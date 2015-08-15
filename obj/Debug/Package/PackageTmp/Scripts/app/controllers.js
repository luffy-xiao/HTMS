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
   
    $scope.items = $scope.rr.Residents;
    InitCtrl($scope, $modal, 'resident',RestService,{},false)

    $scope.ok = function () {
        // submit relocation record
        RestService.getclient('rr').save($scope.rr, function (data) {
           
            $location.path('/resident/detail/' + data.Id + "/readonly=" + true)
        }, function (err) {
            if(err.status == 409)
            alert("记录重复，可能由于该户主已经存在")
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
    $scope.navtodetail = function (rr,readonly) {
        $location.path('/resident/detail/'+rr.Id +"/readonly=" + readonly)
    }

    $scope.del = function (idx) {
        $scope.items = $scope.rrlist
        deleteitem($modal, RestService, 'rr', $scope, idx,true)
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
    
}]).controller('ResidentIssueCtrl', ['$scope', '$modal', 'RestService', '$location', function ($scope, $modal, RestService, $location) {
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

    $scope.navtodetail = function (rr, readonly) {
        $location.path('/resident/detail/' + rr.Id + "/readonly=" + readonly)
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
        var filters = []
        filters.push("CommunityId eq " + $scope.searchparams.CommunityId)
        if ($scope.searchparams.BuildingNumber != null || $scope.searchparams.SizeRange != null) {

            if ($scope.searchparams.BuildingNumber != null) {
                filters.push("BuildingNumber eq " + $scope.searchparams.BuildingNumber)
            }
            if ($scope.searchparams.SizeRange != null && $scope.searchparams.SizeRange !="") {
                if ($scope.searchparams.SizeRange == 1) {
                    filters.push("Size lt 60")
                }
                else if ($scope.searchparams.SizeRange == 2) {
                    filters.push("(Size ge 60 and Size le 90)")
                }
                else if ($scope.searchparams.SizeRange == 3) {
                    filters.push("Size gt 90")
                }
                
            }
            var filterstring = "true";
            filters.forEach(function (f) {
                filterstring += (" and " + f)
            })
        }
        $scope.items = RestService.getclient('appartment').query({ $filter: filterstring ,$orderby: 'BuildingNumber,UnitNumber,DoorNumber' }, function () {
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

.controller('PriceTemplateCtrl', ['$scope', '$modal', 'RestService','$window', function ($scope, $modal, RestService,$window) {
   
    $scope.items = RestService.getclient('pt').query({ $orderby: "Type,Floor asc" },function (data) {
        data.forEach(function (d)
        {
            d.Id = d.Type + d.Floor;
        })
    })
    $scope.$on("added", function (item) {
        $window.location.reload()
    })
    InitCtrl($scope, $modal, 'pt', RestService, {})
  

}]).controller('ContractCtrl', ['$scope', '$modal', 'RestService', '$filter', function ($scope, $modal, RestService, $filter) {
    $scope.searchparams = {}
   // $scope.rbs = RestService.getclient('rb').query()
    $scope.contract = {}
    $scope.$on('added',function(item){
        $scope.contract.AppartmentId = null;
        reloadpr()
    })
    $scope.$on('deleted', function (item) {
        reloadpr()
    })
    $scope.$on('updated', function (item) {
        reloadpr()
    })
    function reloadpr() {
        RestService.getclient('pr').query({ $filter: "RelocationRecordId eq '" + $scope.rr.Id + "'" }, function (prs) {
            $scope.prs = prs
            calculatepr(prs,RestService)
        })
    }
    $scope.query = function () {
        var filters = []
        filters.push("RelationshipType eq '户主'")
        if ($scope.searchparams.Name != null || $scope.searchparams.IdentityCard != null) {

            if ($scope.searchparams.Name != null) {
                filters.push("substringof('" + $scope.searchparams.Name + "',Name)")
            }
            if ($scope.searchparams.IdentityCard != null) {
                filters.push("substringof('" + $scope.searchparams.IdentityCard + "',IdentityCard)")
            }
            var filterstring = "true";
            filters.forEach(function (f) {
                filterstring += (" and " + f)
            })
            $scope.rrlist = []
            RestService.getclient('resident').query({
                $filter: filterstring
            }, function (residents) {

                if (residents.length == 0) {
                    alert("该姓名不存在")
                }
                else if (residents.length == 1) {
                    $scope.rr = RestService.getclient('rr').get({ id: residents[0].RelocationRecordId })
                    RestService.getclient('pr').query({ $filter: "RelocationRecordId eq '" + residents[0].RelocationRecordId + "'" }, function (prs) {
                        $scope.prs = prs
                        calculatepr(prs, RestService)
                        //$scope.contract.RelocationId = rr.RelocationId
                    })
                }
                else {
                    residents.forEach(function (r) {
                        var rr = RestService.getclient('rr').get({ id: r.RelocationRecordId })
                        $scope.rrlist.push(rr)

                    })
                    var modalInstance = $modal.open({
                        templateUrl: "/pages/modal/selectRRModal.html",
                        size: 'lg',
                        controller: "SelectItemModalCtrl",
                        resolve: {
                            list: function () {
                                return $scope.rrlist
                            }
                        }
                    });
                    modalInstance.result.then(function (rr) {
                        $scope.rr = rr
                        RestService.getclient('pr').query({ $filter: "RelocationRecordId eq '" + rr.Id + "'" }, function (prs) {
                            $scope.prs = prs
                            calculatepr(prs, RestService)
                            //$scope.contract.RelocationId = rr.RelocationId
                        })
                    }, function () {

                    });
                }
                $scope.showresidents = true;
            })
        }
        
    }
    $scope.clist = RestService.getclient('community').query()
    $scope.queryapp = function () {
        var filters = []
        filters.push("CommunityId eq " + $scope.searchparams.CommunityId)
        if (($scope.searchparams.BuildingNumber != null && $scope.searchparams.BuildingNumber!="") ||
            ($scope.searchparams.SizeRange != null && $scope.searchparams.SizeRange)) {

            if ($scope.searchparams.BuildingNumber != null) {
                filters.push("BuildingNumber eq " + $scope.searchparams.BuildingNumber)
            }
            if ($scope.searchparams.SizeRange != null && $scope.searchparams.SizeRange != "") {
                if ($scope.searchparams.SizeRange == 1) {
                    filters.push("Size lt 60")
                }
                else if ($scope.searchparams.SizeRange == 2) {
                    filters.push("(Size ge 60 and Size le 90)")
                }
                else if ($scope.searchparams.SizeRange == 3) {
                    filters.push("Size gt 90")
                }

            }
        }
        var filterstring = "true";
        filters.forEach(function (f) {
            filterstring += (" and " + f)
        })
        $scope.applist = RestService.getclient('appartment').query({
            $filter: filterstring +  " and Status ne '已售'" 
            , $orderby: 'BuildingNumber,UnitNumber,DoorNumber'
        }, function () {
            var modalInstance = $modal.open({
                templateUrl: "/pages/modal/selectappModal.html",
                size: 'lg',
                controller: "SelectItemModalCtrl",
                resolve: {
                    list: function () {
                        return $scope.applist
                    }
                }
            });
            modalInstance.result.then(function (item) {
                $scope.selectedapp = item
                $scope.contract.AppartmentId = item.Id
                $scope.appselected = true;
                initialize()
            }, function () {

            }); 
        })
    }

    $scope.contracts = function () {
        $scope.contractlist = RestService.getclient('contract').query({ $filter: "PlacementRecordId eq " + $scope.contract.PlacementRecordId }, function () {
            $scope.showcontracts = true;
            $scope.items = $scope.contractlist
            initialize()
        })
    }
    $scope.printA = function (idx) {
        window.open( "/print.html#/contracts/"+$scope.contractlist[idx].Id+"/print")
    }
    $scope.printB = function (idx) {
        window.open("/print.html#/placementrecords/" + $scope.prs[idx].Id + "/print")
    }
    var initialize = function () {
        if ($scope.contract.AppartmentId != null || $scope.contract.PlacementRecordId != null) {
            InitCtrl($scope, $modal, 'contract', RestService, {
                AppartmentId: $scope.contract.AppartmentId,
                PlacementRecordId: $scope.contract.PlacementRecordId
            })
            
        }
    }



}]).controller('PlacementRecordCtrl', ['$scope', '$modal', 'RestService','$filter', function ($scope, $modal, RestService,$filter) {
   
    $scope.searchparams = {}
    $scope.rbs = RestService.getclient('rb').query()
    $scope.contract = {}
    $scope.$on("added", function (item) {
        RestService.getclient('rr').get({ id: $scope.rr.Id }, function (rr) {
            $scope.rr = rr
            loadpr()
        })
    })
    $scope.$on("updated", function (item) {
        RestService.getclient('rr').get({ id: $scope.rr.Id }, function (rr) {
            $scope.rr = rr
            loadpr()
        })
    })

    $scope.$on("deleted", function (item) {
        RestService.getclient('rr').get({ id: $scope.rr.Id }, function (rr) {
            $scope.rr = rr
            loadpr()
        })
    })
    $scope.query = function () {
        var filters = []
        filters.push("RelationshipType eq '户主'")
        if ($scope.searchparams.Name != null || $scope.searchparams.IdentityCard != null) {

            if ($scope.searchparams.Name != null) {
                filters.push("substringof('" + $scope.searchparams.Name + "',Name)")
            }
            if ($scope.searchparams.IdentityCard != null) {
                filters.push("substringof('" + $scope.searchparams.IdentityCard + "',IdentityCard)")
            }
            var filterstring = "true";
            filters.forEach(function (f) {
                filterstring += (" and " + f)
            })
            $scope.rrlist = []
            RestService.getclient('resident').query({
                $filter: filterstring
            }, function (residents) {

                if (residents.length == 0) {
                    alert("该姓名不存在")
                }
                else if (residents.length > 1) {
                    residents.forEach(function (r) {
                        var rr = RestService.getclient('rr').get({ id: r.RelocationRecordId })
                        $scope.rrlist.push(rr)

                    })
                    var modalInstance = $modal.open({
                        templateUrl: "/pages/modal/selectRRModal.html",
                        size: 'lg',
                        controller: "SelectItemModalCtrl",
                        resolve: {
                            list: function () {
                                return $scope.rrlist
                            }
                        }
                    });
                    modalInstance.result.then(function (rr) {
                        $scope.rr = rr
                        loadpr()

                    }, function () {

                    });
                }
                else if (residents.length == 1) {
                    RestService.getclient('rr').get({ id: residents[0].RelocationRecordId }, function (rr) {
                        $scope.rr = rr
                        loadpr()
                    })


                }

            })

        }
    }
    function loadpr() {

        $scope.showresidents = true;
        $scope.items = []

        $scope.prs = RestService.getclient('pr').query({ $filter: "RelocationRecordId eq '" + $scope.rr.Id + "'" }, function (prs) {
            calculatepr(prs, RestService)
            $scope.items = prs
            InitCtrl($scope, $modal, 'pr', RestService, { RelocationRecordId: $scope.rr.Id })
        })
    }   
}])
.controller('PrintACtrl', ['$scope', '$modal', 'RestService', '$routeParams', function ($scope, $modal, RestService, $routeParams) {
    var id = $routeParams.id
    $scope.contract = RestService.getclient('contract').get({ id: id }, function (item) {
        $scope.rr = RestService.getclient('rr').get({ id: item.PlacementRecord.RelocationRecordId }, function (rr) {
            var date = new Date(rr.DeliveryDate)
            $scope.dd = {}
            $scope.dd.year = date.getFullYear()
            $scope.dd.month = date.getMonth()
            $scope.dd.day = date.getDate()
        })
        while (item.PlacementRecord.Residents.length < 6) {
            item.PlacementRecord.Residents.push({})
        }
        while (item.AppartmentOwners.length < 6) {
            item.AppartmentOwners.push({})
        }
    })
    $scope.totalprice = function () {
        if($scope.contract == null || $scope.contract.Appartment==null) return "N/A"
        else return $scope.contract.Appartment.Price1 * $scope.contract.Size1+　
            $scope.contract.Appartment.Price2 * $scope.contract.Size2 + 
            $scope.contract.Appartment.Price3 * $scope.contract.Size3 + 
            $scope.contract.Appartment.Price4 * $scope.contract.Size4
    }
}]).controller('PrintBCtrl', ['$scope', '$modal', 'RestService', '$routeParams', function ($scope, $modal, RestService, $routeParams) {
    var id = $routeParams.id
    $scope.pr = RestService.getclient('pr').get({ id: id }, function (pr) {
        $scope.contracts = RestService.getclient('contract').query({$filter: "PlacementRecordId eq "+ pr.Id }, function (contracts) {
           
        })
        $scope.rr = RestService.getclient('rr').get({id:pr.RelocationRecordId},function(rr){
        
        })
    })
    
    $scope.totalprice = function (idx) {
        var contract = $scope.contracts[idx]
        if (contract == null) return "N/A"
        else return contract.Appartment.Price1 * contract.Size1 +
            contract.Appartment.Price2 * contract.Size2 +
            contract.Appartment.Price3 * contract.Size3 +
            contract.Appartment.Price4 * contract.Size4
    }
    $scope.delta = function (idx) {
        var contract = $scope.contracts[idx]
        var i = idx
        var totalprice = 0
        while (i >= 0) {
            totalprice += $scope.totalprice(i)
            i--
        }
        return totalprice - $scope.pr.TotalCompensation >0 ? totalprice - $scope.pr.TotalCompensation:0
    }
    $scope.totalfee = function (idx) {
        var contract = $scope.contracts[idx]
        return  contract.GasFee + contract.OtherFee + contract.TransitionFee + contract.TVFee + contract.InterestFee + contract.RepairUnitPrice * contract.Appartment.Size + $scope.delta(idx)
    }
    $scope.owners = function (idx) {
        var contract = $scope.contracts[idx]
        var names=""
        contract.AppartmentOwners.forEach(function (o) {
            names += o.Name +" "
        })
        return names
    }
}])





function additem($modal, type, $scope, item,commit) {
    var items = $scope.items
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
        $scope.$broadcast('added',item)
    }, function () {

    });
}
function modifyitem($modal, type, $scope, idx,commit) {
    var items = $scope.items
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
        $scope.$broadcast('updated', item)
    }, function () {

    });
}
function deleteitem($modal, RestService, type, $scope, idx, commit) {
    var items = $scope.items
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
                $scope.$broadcast('deleted', item)
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
        additem($modal, type, $scope, newitem,commit)
    }
    $scope.modify = function (idx) {
        modifyitem($modal, type, $scope, idx,commit)
    }
    $scope.del = function (idx) {
        deleteitem($modal, RestService, type, $scope, idx,commit)
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

function calculatepr(prs, RestService) {
    prs.forEach(function (pr) {
        var name = "";
        pr.Residents.forEach(function (r) {
            name += r.Name + " "
        })
        pr.Name = name
        RestService.getclient('contract').query({ $filter: "PlacementRecordId eq " + pr.Id }, function (contracts) {
            var total = 0
            var size = 0;
            contracts.forEach(function (c) {
                total += c.Size1 * c.Appartment.Price1 + c.Size2 * c.Appartment.Price2 + c.Size3 * c.Appartment.Price3 + c.Size4 * c.Appartment.Price4;
                size += c.Size1 + c.Size2 + c.Size3 + c.Size4;
            })
            pr.LeftCompensation = pr.TotalCompensation - total
            pr.LeftSize = pr.Size - size
        })
    })
}