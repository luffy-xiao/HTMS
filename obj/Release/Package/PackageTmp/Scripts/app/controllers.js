'use strict';

/* Controllers */

var appControllers = angular.module('ms.site.controllers', ['ms.site.controllers.modal','ui.grid','ui.bootstrap']);


appControllers.controller('ResidentCreateCtrl', ['$scope', '$modal', 'RestService','$location', function ($scope, $modal, RestService,$location) {

    $scope.rbs = RestService.getclient('rb').query();
    $scope.rr = {}
    $scope.rr.Residents = []
    $scope.rr.Residents[0] = {}
    $scope.rr.Residents[0].RelationshipType = "户主"       
    $scope.rr.DateCreated = moment().format("YYYY-MM-DD")
    $scope.buttonshow = true;
    $scope.vlist = RestService.getclient('village').query();
    $scope.rr.Id = $scope.rr.RelocationBase + $scope.rr.RRId;
    $scope.items = $scope.rr.Residents;
    InitCtrl($scope, $modal, 'resident',RestService,{},false)

    $scope.ok = function () {
        // submit relocation record
        $scope.rr.Id = $scope.rr.RelocationBase + $scope.rr.RRId;
        RestService.getclient('rr').save($scope.rr, function (data) {
           
            $location.path('/resident/detail/' + data.Id + "/readonly=" + true)
        });
     
    }
    //datapickers
    InitDataPicker($scope)

  



}]).controller('NavCtrl', ['$scope', '$rootScope', '$modal', 'UserService', function ($scope, $rootScope, $modal, UserService) {
    function openlogindialog() {
        var modalInstance = $modal.open({
            templateUrl: '/pages/modal/LoginModal.html',
            controller: 'LoginModalCtrl',
            size: 'lg',
            backdrop: false,
            keyboard: false
        });


        modalInstance.result.then(function () {

        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });

        $scope.$on('user_changed', function (event, data) {
            if (data == null) {
                openlogindialog()
            }
            $scope.user = data;
        })
    }
    if (!UserService.getcurrentuser()) {
        openlogindialog()
    }
    else {
        $rootScope.user = UserService.getcurrentuser()
    }
    $scope.logout = function () {
        UserService.logout()
    }


}]).controller('MenuCtrl', ['$scope', '$modal', 'UserService', function ($scope, $modal, UserService) {


}]).controller('UserListCtrl', ['$scope', '$modal', 'RestService', function ($scope, $modal, RestService) {
    $scope.items = RestService.getclient('user').query();
    InitCtrl($scope, $modal, 'user', RestService, {Roles:[]})

}]).controller('RBListCtrl', ['$scope', '$modal', 'RestService', function ($scope, $modal, RestService) {
    $scope.items = RestService.getclient('rb').query();
    InitCtrl($scope, $modal, 'rb', RestService, {})
}]).controller('ResidentSearchCtrl', ['$scope', '$modal', 'RestService', '$location', function ($scope, $modal, RestService, $location) {
    //build filter string 
    
    $scope.searchbyR = function () {
        $scope.rrlist = []
        var filters = []
        if ($scope.searchparams.Name != null || $scope.searchparams.IdentityCard != null) {

            if ($scope.searchparams.Name != null) {
                filters.push("substringof('" + $scope.searchparams.Name + "',Name)")
            }
            if ($scope.searchparams.IdentityCard != null) {
                filters.push("substringof('" + $scope.searchparams.IdentityCard + "',IdentityCard)")
            }
            var filterstring = "true";
            filters.forEach(function(f){
                filterstring += (" and " + f)
            })
            RestService.getclient('resident').query({ $filter: filterstring }, function (residents) {
                residents.forEach(function (r) {
                    var rr = RestService.getclient('rr').get({ id: r.RelocationRecordId })
                    $scope.rrlist.push(rr)

                })
                $scope.showresult = true
            })
        }
    }
    $scope.searchbyRR = function () {
        $scope.rrlist = []
        var filters = []
        if ($scope.searchparams.RRId != null) {
            filters.push("RRId eq '" +  $scope.searchparams.RRId + "'")
        }
        var filterstring = "true";
        filters.forEach(function (f) {
            filterstring += (" and " + f)
        })
        $scope.rrlist = RestService.getclient('rr').query({ $filter: filterstring }, function () {
            $scope.showresult = true
        })
    }

    

    $scope.navtodetail = function (rr,readonly) {
        $location.path('/resident/detail/'+rr.Id +"/readonly=" + readonly)
    }

    $scope.del = function (idx) {
        deleteitem($modal, RestService, 'rr', $scope.rrlist, idx,true)
    }
}]).controller('ResidentDetailCtrl', ['$scope', '$modal', '$filter', 'RestService', '$routeParams','$location', function ($scope, $modal, $filter, RestService, $routeParams,$location) {
    $scope.rbs = RestService.getclient('rb').query();
    $scope.rr = RestService.getclient('rr').get({ id: $routeParams.id }, function (rr) {
        
        $scope.vlist = RestService.getclient('village').query();
        $scope.items = rr.Residents
        var owner = $filter('filter')($scope.items, { RelationshipType: '户主' }, true)[0]
        $scope.items.splice($scope.items.indexOf(owner),1)
        $scope.items.unshift(owner);
        InitCtrl($scope, $modal, 'resident', RestService, { RelocationRecordId: $scope.rr.Id }, true)
    })

    $scope.notnew = true;
    var readonly = $routeParams.readonly
   
    if (readonly == "true") {
        
        $("input").attr('readonly', true)
        $("select").attr('disabled', true)
    } else {
        $scope.buttonshow = true;
      
    }
    $scope.ok = function () {
        //update the record
       
        RestService.getclient('rr').update({ Id: $scope.rr.Id }, $scope.rr, function () {
            $location.path('/resident/detail/' + $scope.rr.Id + "/readonly=" + true)
        }, function (err) {
            alert(err)
        })

    }
    $scope.loadgroups = function () {
   
        $scope.glist = RestService.getclient('group').query({ $filter: "VillageId eq " + $scope.rr.Group.VillageId }, function () {
            $scope.enablegroup = true;
            $scope.rr.GroupId = null;
        })
    }
   
    InitDataPicker($scope)
    
}]).controller('ResidentIssueCtrl', ['$scope', '$modal', 'RestService', function ($scope, $modal, RestService) {
    $scope.items = RestService.getclient('resident').query({ $filter: "Status eq 0" }, function (rs) {
        rs.forEach(function(r){
            r.RelocationRecord = RestService.getclient('rr').get({id:r.RelocationRecordId})
        })
    })
    $scope.pass = function (idx) {
        var modalInstance = $modal.open({
            templateUrl: "/pages/modal/confirmModal.html",
            size: 'lg',
            controller: "ConfirmModalCtrl"
        });
        modalInstance.result.then(function () {
            $scope.items[idx].Status = 1;
            RestService.getclient('resident').update({ id: $scope.items[idx].Id }, $scope.items[idx], function (r) {
                $scope.items[idx].Status =1
            }, function (err) {
                alert(err.statusCode)
            })
        })
        
    }

}]).controller('VillageCtrl', ['$scope', '$modal', 'RestService', function ($scope, $modal, RestService) {
    $scope.items = RestService.getclient('village').query()
    InitCtrl($scope, $modal, 'village', RestService, {})

}]).controller('GroupCtrl', ['$scope', '$modal', 'RestService', function ($scope, $modal, RestService) {
    $scope.vlist = RestService.getclient('village').query()
    $scope.query = function () {
        $scope.items = RestService.getclient('group').query({ $filter: "VillageId eq " + $scope.SelectedVId }, function () {
            $scope.showresult = true;
        })
        InitCtrl($scope, $modal, 'group', RestService, { VillageId: $scope.SelectedVId })
    }
   
  
}]).controller('CommunityCtrl', ['$scope', '$modal', 'RestService', function ($scope, $modal, RestService) {
    $scope.items = RestService.getclient('community').query()
    InitCtrl($scope, $modal, 'community', RestService, {})

}]).controller('BuildingCtrl', ['$scope', '$modal', 'RestService', function ($scope, $modal, RestService) {
    $scope.clist = RestService.getclient('community').query()
    $scope.query = function () {
        $scope.items = RestService.getclient('building').query({ $filter: "CommunityId eq " + $scope.SelectedVId }, function () {
            $scope.showresult = true;
        })
        InitCtrl($scope, $modal, 'building', RestService, { CommunityId: $scope.SelectedVId })
    }

   

}]).controller('AppartmentCtrl', ['$scope', '$modal', 'RestService', function ($scope, $modal, RestService) {
    $scope.searchparams = {}
    $scope.clist = RestService.getclient('community').query()
   
    $scope.query = function () {
        $scope.items = RestService.getclient('appartment').query({ $filter: "CommunityId eq " + $scope.searchparams.CommunityId ,$orderby: 'BuildingNumber,UnitNumber,DoorNumber' }, function () {
            $scope.showresult = true;
        })
        InitCtrl($scope, $modal, 'appartment', RestService, { CommunityId: $scope.searchparams.CommunityId })
    }

}])
.controller('BulkCreateCtrl', ['$scope', '$modal', 'RestService', '$interval', '$rootScope', '$filter', function ($scope, $modal, RestService, $interval, $rootScope, $filter) {
    var headers = [];
    $scope.elist = RestService.getclient('model').query(function (data) {
        if (data == "") {
            $scope.model = {}
            $scope.model.Name = 'model';
            //$scope.gridOptions.columnDefs = [{ name: "Name", displayName: "模型名称" }, { name: "Name", displayName: "模型名称" }]
        }
    });
    $scope.loadheader = function () {
        headers = [];
        $scope.gridOptions.columnDefs = []
        $scope.header = RestService.getclient('header').query({ $filter: "ModelName eq '" + $scope.model.Name + "'" }, function (data) {
            var line1 = {}
            data.forEach(function (d) {
                $scope.gridOptions.columnDefs.push({ name: d.Field, displayName: d.Name, width: 100 })
                
                line1[d.Field] = d.Name
            })
            headers.push(line1);

        })
    }
    $scope.template = function () {
        alasql('SELECT * INTO XLSX("模板_' + $scope.model.DisplayName + '.xlsx") FROM ?', [headers]);
    }
    
    $scope.fileChanged = function (event) {
        
        alasql('SELECT * FROM FILE(?,{headers:true})', [event], function (res) {
                    
            $scope.$apply(function () {
                $scope.gridOptions.data = res
                $scope.gridOptions.data.splice(0, 1);
                if ($scope.model.Name == 'rr') {
                    $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data, { RelationshipType: '户主' }, true)
                }
                if ($scope.model.Name == 'appartment') {
                    RestService.getclient('pt').query(function (ptlist) {
                        $scope.gridOptions.data.forEach(function (app) {
                            var template = $filter('filter')(ptlist, { Type: app.BuildingType, Floor: app.Floor }, true)[0]
                            app.Price1 = template.Price1
                            app.Price2 = template.Price2
                            app.Price3 = template.Price3
                            app.Price4 = template.Price4
                        })

                    })
                   

                }
                $scope.max = $scope.gridOptions.data.length;
            })
           
        });

    }
    $scope.add = function () {
        var i = 0;
        $scope.success = 0
        $scope.failure = 0
        $scope.dynamic = 0;
        $scope.adding = true;
        
     
        var timer =   $interval(function () {
            
            if (i >= $scope.gridOptions.data.length) {
                return;
                
            }
           
            
            RestService.getclient($scope.model.Name).save($scope.gridOptions.data[i], function () {
                $scope.success++;
                $scope.dynamic++
                if ($scope.dynamic >= $scope.max) {
                    $scope.adding = false;
                    $interval.cancel(timer)
                }

            }, function () {
                $scope.failure++;
                $scope.dynamic++
                if ($scope.dynamic >= $scope.max) {
                    $scope.adding = false;
                    $interval.cancel(timer)
                }
            })
            i++
            
        }, 20);

    }
    $scope.gridOptions = {
        enableFiltering: false,
        enableColumnMenus: false,
        enableSorting: false,
    }
    var cols = [];
    for(var x in $scope.header){
        var col = {}
        col.name = x
        col.displayName = header[x]
        cols.push(col)
    }
   // $scope.gridOptions.columnDefs = cols

   
}])

.controller('PriceTemplateCtrl', ['$scope', '$modal', 'RestService', function ($scope, $modal, RestService) {
   
    $scope.items = RestService.getclient('pt').query(function (data) {
        data.forEach(function (d) {
            d.Id = d.Type
        })
    })
    InitCtrl($scope, $modal, 'pt', RestService, {})
  

}]).controller('ContractCtrl', ['$scope', '$modal', 'RestService', '$filter', function ($scope, $modal, RestService, $filter) {
    $scope.searchparams = {}
   // $scope.rbs = RestService.getclient('rb').query()
    $scope.contract = {}
   
    $scope.query = function () {
        RestService.getclient('resident').query({ $filter: "IdentityCard eq '" + $scope.searchparams.IdentityCard
            + "' and RelationshipType eq '户主'"}, function (residents) {

            if (residents.length == 0) {
                alert("该姓名不存在")
            }
            else if (residents.length == 1) {
                RestService.getclient('pr').query({ $filter: "RelocationRecordId eq '" + residents[0].RelocationRecordId + "'" }, function (prs) {
                        $scope.prs = prs
                        //$scope.contract.RelocationId = rr.RelocationId
                })
            }
            else {
                alert("该人员在系统中存在多个，联系管理员")
            }
            $scope.showresidents = true;
        })
        
    }
    $scope.clist = RestService.getclient('community').query() //TODO:status == '可售'
    $scope.queryapp = function () {
        $scope.applist = RestService.getclient('appartment').query({
            $filter: "CommunityId eq " + $scope.searchparams.CommunityId + "and Status ne '已售'" 
            , $orderby: 'BuildingNumber,UnitNumber,DoorNumber'
        }, function () {
            $scope.showapps = true;
        })
    }
    $scope.selectapp = function () {
        var selected = $filter('filter')($scope.applist, { Id: $scope.contract.AppartmentId }, true)[0]
        $scope.applist = [selected]
        $scope.appselected = true;
        initialize()
        
    }
    $scope.contracts = function () {
        $scope.contractlist = RestService.getclient('contract').query({ $filter: "PlacementRecordId eq " + $scope.contract.PlacementRecordId }, function () {
            $scope.showcontracts = true;
            $scope.items = $scope.contractlist
            initialize()
        })
    }
    var initialize = function () {
        if ($scope.contract.AppartmentId != null || $scope.contract.PlacementRecordId != null) {
            InitCtrl($scope, $modal, 'contract', RestService, {
                AppartmentId: $scope.contract.AppartmentId,
                PlacementRecordId: $scope.contract.PlacementRecordId
            })
            
        }
    }

    $scope.preview = function () {
        var modalInstance = $modal.open({
            templateUrl: "/pages/modal/contractModal.html",
            size: 'lg',
            controller: "ContractModalCtrl",
            resolve: {
                contract:function() {
                    return $scope.contract
                }
            }
        });
        modalInstance.result.then(function (item) {
            $scope.contractlist.push(item)
        }, function () {

        });
    }


}]).controller('PlacementRecordCtrl', ['$scope', '$modal', 'RestService','$filter', function ($scope, $modal, RestService,$filter) {
   
    $scope.searchparams = {}
    $scope.rbs = RestService.getclient('rb').query()
    $scope.contract = {}

    $scope.query = function () {
        RestService.getclient('resident').query({
            $filter: "IdentityCard eq '" + $scope.searchparams.IdentityCard
                + "' and RelationshipType eq '户主'"
        }, function (residents) {

            if (residents.length == 0) {
                alert("该姓名不存在")
            }
            else if (residents.length == 1) {
                RestService.getclient('rr').get({ id: residents[0].RelocationRecordId }, function (rr) {
                    if ($scope.searchparams.RelocationBase != rr.RelocationBase) {
                        alert('该拆迁户存在于' + rr.RelocationBase)
                    } else {
                        $scope.rr = rr
                        $scope.contract.RelocationId = rr.RelocationId
                        $scope.showresidents = true;
                        $scope.items = []
                       
                        $scope.prs = RestService.getclient('pr').query({ $filter: "RelocationRecordId eq '" + rr.Id + "'" }, function (prs) {
                            prs.forEach(function (pr) {
                                var name = "";
                                pr.Residents.forEach(function (r) {
                                    name += r.Name + " "
                                })
                                pr.Name = name
                            })
                            $scope.items = prs
                            InitCtrl($scope, $modal, 'pr', RestService, { RelocationRecordId: $scope.rr.Id })
                        })
                    }
                })
            }
            else {
                alert("该人员在系统中存在多个，联系管理员")
            }

           
        })

    }
  

}])


function additem($modal, type, items, item,commit) {
    var template = "/pages/modal/" + type + "Modal.html"
    if (typeof commit === 'undefined') { commit = true; }
    var modalInstance = $modal.open({
        templateUrl: template,
        size: 'lg',
        controller: "SaveItemModalCtrl",
        resolve: {
            type: function () {
                return type
            },
            item: function () {
                return item
            },
            commit: function(){
                return commit 
            }
        }
    });
    modalInstance.result.then(function (item) {
        items.push(item)
        
    }, function () {

    });
}
function modifyitem($modal, type, items, idx,commit) {
    var template = "/pages/modal/" + type + "Modal.html"
    if (typeof commit === 'undefined') { commit = true; }
    var modalInstance = $modal.open({
        templateUrl: template,
        size: 'lg',
        controller: "SaveItemModalCtrl",
        resolve: {
            type: function () {
                return type
            },
            item: function () {
                return items[idx]
            },
            commit: function () {
                return commit 
            }
        }
    });
    modalInstance.result.then(function (item) {
        items[idx] = item;
    }, function () {

    });
}
function deleteitem($modal, RestService,type, items, idx,commit) {
    var modalInstance = $modal.open({
        templateUrl: "/pages/modal/confirmModal.html",
        size: 'lg',
        controller: "ConfirmModalCtrl"
    });
    if (typeof commit === 'undefined') { commit = true; }
    modalInstance.result.then(function () {
        if (commit) {
            RestService.getclient(type).remove({ id: items[idx].Id }, function () {
                items.splice(idx, 1)
            }, function (data) {
                if (data.status == "403") {
                    alert("无法删除，系统中有相关记录");
                }
               
            })
        } else {
            items.splice(idx, 1)
        }
        

    }, function () {

    });
}

function InitCtrl($scope, $modal, type, RestService, newitem,commit){
    $scope.add = function () {
        additem($modal, type, $scope.items, newitem,commit)
    }
    $scope.modify = function (idx) {
        modifyitem($modal, type, $scope.items, idx,commit)
    }
    $scope.del = function (idx) {
        deleteitem($modal, RestService, type, $scope.items, idx,commit)
    }
}

function InitDataPicker($scope) {
    $scope.datepickers = {
        dt: false,
        dt2: false,
        dt3: false,
        dt4: false
    }

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        showWeeks: false
    }

    $scope.open = function ($event, which) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datepickers[which] = true;
    };
}