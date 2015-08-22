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
    // Pagination.
    $scope.currentPage = 1;
    $scope.maxSize = 10; // How many page links shown.
    $scope.itemsPerPage = 20;

    // Cache filterstring used in query.
    var filterstring;

    $scope.pageChanged = function () {
        $scope.rrlist = [];
        var skip = ($scope.currentPage - 1) * $scope.itemsPerPage;

        RestService.getclient('resident').query({
            $filter: filterstring, $inlinecount: 'allpages',
            $skip: skip, $top: $scope.itemsPerPage
        }, function (residents) {
            // Set total count.
            $scope.totalItems = residents.Count;
            residents.Items.forEach(function (r) {
                var rr = RestService.getclient('rr').get({ id: r.RelocationRecordId })
                $scope.rrlist.push(rr)

            })
            $scope.showresult = true;
        });
    };

    $scope.searchbyR = function () {
        var filters = [];
        if ($scope.searchparams.Name != null || $scope.searchparams.IdentityCard != null) {
            if ($scope.searchparams.Name != null) {
                filters.push("substringof('" + $scope.searchparams.Name + "',Name)")
            }
            if ($scope.searchparams.IdentityCard != null) {
                filters.push("substringof('" + $scope.searchparams.IdentityCard + "',IdentityCard)")
            }
            // Reset filterstring occording to current filters.
            filterstring = "true";
            filters.forEach(function (f) {
                filterstring += (" and " + f)
            });

            // Search from beginning when click search button.
            $scope.currentPage = 1;
            $scope.pageChanged();
        }
    };

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
        if (owner == null) {
            owner = $scope.items[0]
        }
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
    // Pagination.
    $scope.currentPage = 1;
    $scope.maxSize = 10; // How many page links shown.
    $scope.itemsPerPage = 20;

    $scope.pageChanged = function () {
        var skip = ($scope.currentPage - 1) * $scope.itemsPerPage;

        RestService.getclient('resident').query({
            $filter: "Status eq 0", $inlinecount: 'allpages',
            $skip: skip, $top: $scope.itemsPerPage
        }, function (rs) {
            $scope.items = rs.Items;
            // Set total items.
            $scope.totalItems = rs.Count;

            rs.Items.forEach(function (r) {
                r.RelocationRecord = RestService.getclient('rr').get({ id: r.RelocationRecordId });
            });
        });
    };
    
    // Load 1st page.
    $scope.pageChanged();

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
    $scope.searchparams = {};
    $scope.clist = RestService.getclient('community').query();

    // Pagination.
    $scope.currentPage = 1;
    $scope.maxSize = 10; // How many page links shown.
    $scope.itemsPerPage = 100;

    // Cache filterstring used in query.
    var filterstring;

    $scope.pageChanged = function () {
        var skip = ($scope.currentPage - 1) * $scope.itemsPerPage;

        RestService.getclient('appartment').query({
            $filter: filterstring, $orderby: 'BuildingNumber,UnitNumber,DoorNumber',
            $inlinecount: 'allpages', $skip: skip, $top: $scope.itemsPerPage
        }, function (apartments) {
            // Set total count.
            $scope.totalItems = apartments.Count;
            $scope.items = apartments.Items;
            $scope.showresult = true;
        });
    };

    $scope.query = function () {
        var filters = []
        filters.push("CommunityId eq " + $scope.searchparams.CommunityId)

        if ($scope.searchparams.BuildingNumber != null && $scope.searchparams.BuildingNumber.trim() != '') {
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
        if ($scope.searchparams.Status != null && $scope.searchparams.Status != "") {
            if ($scope.searchparams.Status == 0) {
                filters.push("Status eq '可售'");
            }
            else if ($scope.searchparams.Status == 1) {
                filters.push("Status eq '已售'");
            }
        }

        filterstring = "true";
        filters.forEach(function (f) {
            filterstring += (" and " + f)
        });
        $scope.currentPage = 1;
        $scope.pageChanged();

        InitCtrl($scope, $modal, 'appartment', RestService, { CommunityId: $scope.searchparams.CommunityId });
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
    $scope.rbarray = []
    $scope.rbs = RestService.getclient('rb').query(function (rbs) {
        rbs.forEach(function (rb) {
            $scope.rbarray[rb.Id] = rb
        })
        
    })


    $scope.fileChanged = function (event) {
        
        alasql('SELECT * FROM FILE(?,{headers:true})', [event], function (res) {
                    
            $scope.$apply(function () {
                $scope.gridOptions.data = res
                $scope.gridOptions.data.splice(0, 1);
                $scope.err = []
                if ($scope.model.Name == 'rbmap') {
                    $scope.rbmap = []
                    $scope.gridOptions.data.forEach(function (d) {                       
                        $scope.rbmap[d.rb_down] = []
                        d.rb_up.split(',').forEach(function (r) {
                            $scope.rbmap[d.rb_down].push(r)
                        })
                       
                    })
                }
                if ($scope.model.Name == 'rr') {
                    var rrlist = []
                    var rbs = RestService.getclient('rb').query(function (rbs) {
                        rbs.forEach(function (rb) {
                            var list_temp = []
                            var data = $filter('filter')($scope.gridOptions.data,{RelocationBase_t:rb.Name},true)
                            data.forEach(function (item) {
                                if (item.OwnerName_t == item.Name) {
                                    item.Residents = []
                                    item.RelocationBaseId = rb.Id
                                    rrlist.push(item)
                                    list_temp.push(item)
                                }
                            })
                            data.forEach(function (item) {

                                var r = {}
                                r.Name = item.Name
                                r.Phone = item.Phone
                                r.IdentityCard = item.IdentityCard
                                if (r.IdentityCard == null && r.RelocationoType == '居住') {

                                    $scope.err.push({ reason: "没有身份证信息", data: angular.toJson(r) })
                                    return;
                                }
                                r.RelationshipType = item.RelationshipType
                                var rr = $filter('filter')(list_temp, { RelocationBase_t: item.RelocationBase_t, RRId_t: item.RRId_t, OwnerName_t: item.OwnerName_t }, true)[0]
                                if (rr == null) {
                                    $scope.err.push({ reason: "没有找到RR", data: angular.toJson(item) })
                                  
                                } else {
                                    rr.Residents.push(r)
                                }


                            })
                        })
                        
                        
                        $scope.gridOptions.data = rrlist
                        $scope.max = $scope.gridOptions.data.length;
                    })
                    
                }
                if ($scope.model.Name == 'appartment') {
                    RestService.getclient('pt').query(function (ptlist) {
                        $scope.gridOptions.data.forEach(function (app) {
                            if ( app.Price1==null || app.Price1 == "") {
                                var template = $filter('filter')(ptlist, { Type: app.BuildingType, Floor: app.Floor }, true)[0]
                                app.Price1 = template.Price1
                                app.Price2 = template.Price2
                                app.Price3 = template.Price3
                                app.Price4 = template.Price4
                            }
                        })

                    })
                    RestService.getclient('community').query("", function (clist) {
                        $scope.gridOptions.data.forEach(function(app){
                            if (app.CommunityName != null || app.CommunityName != "") {
                                app.CommunityId = $filter('filter')(clist,{Name:app.CommunityName})[0].Id
                            }
                        })
                    })
                }
                if ($scope.model.Name == 'pr') {
                  
                    RestService.getclient('resident').query(function (residents) {
                        var rearray = []

                        residents.Items.forEach(function (r) {
                            
                            if (r.IdentityCard == null) {
                                return
                            }
                            if (rearray[r.IdentityCard.toUpperCase()] == null) {
                                rearray[r.IdentityCard.toUpperCase()] = []
                            }

                            rearray[r.IdentityCard.toUpperCase()].push(r)
                        })
                        RestService.getclient('rr').query(function (rrs) {
                            var rrarray = []
                            rrs.forEach(function(rr){
                                rrarray[rr.Id] = rr
                            })
                            var prs = []
                            $scope.gridOptions.data.forEach(function (item) {
                                 if (item.IdentityCard_t == null) {
                                     $scope.err.push({ reason: "身份证号缺失", data:angular.toJson(item) })
                                     return
                                }
                                else if (item.IdentityCard_t!=null && item.IdentityCard_t.length == 15) {
                                    var tempid = item.IdentityCard_t.substring(0, 6) + '19' + item.IdentityCard_t.substring(6, 15)
                                    item.IdentityCard_t = tempid + validateidenttiycard(tempid)
                                } else if (item.IdentityCard_t != null && item.IdentityCard_t.length == 17) {
                                    
                                    item.IdentityCard_t = item.IdentityCard_t + validateidenttiycard(item.IdentityCard_t)
                                }
                                //rbs is rb in up
                               /* var rb = $filter('filter')($scope.rbs, { Name: $scope.rbmap[item.RB_t] },true)
                                if (rb.length > 1) {
                                    if ($scope.err.indexOf("dup rb error " + item.RB_t)<0) {
                                        $scope.err.push("dup rb error " + item.RB_t)
                                    }
                                } else if (rb.length == 0) {
                                    if ($scope.err.indexOf("no rb error " + item.RB_t) < 0) {
                                        $scope.err.push("no rb error " + item.RB_t)
                                    }
                                   
                                }*/
                                 if (item.RB_t == null) {
                                     $scope.err.push({ reason: "没有拆迁基地信息", data: angular.toJson(item) })
                                    
                                     return
                                 }
                              
                                 var rs = rearray[item.IdentityCard_t.toUpperCase()]
                                var match = null;
                                if (rs == null || rs.length == 0) {
                                    $scope.err.push({ reason: "没有对应拆迁记录", data: angular.toJson(item) })
                                  
                                    return
                                } else if (rs.length == 1) {
                                    match = rs[0]
                                }
                                else if (rs.length > 1) {
                                    var found = 0;
                                 
                                    
                                    rs.forEach(function (r) {
                                        var rbname = $scope.rbarray[rrarray[r.RelocationRecordId].RelocationBaseId].Name
                                        if ($scope.rbmap[item.RB_t]!=null && $scope.rbmap[item.RB_t].indexOf(rbname)>-1) {
                                            found++
                                            if (match == null) {
                                                match = r
                                            } else if (rrarray[r.RelocationRecordId].TotalCompensation!= null && 
                                                rrarray[r.RelocationRecordId].TotalCompensation > rrarray[match.RelocationRecordId].TotalCompensation) {
                                                match = r
                                            }
                                        }
                                        else if ($scope.rbmap[item.RB_t] == null) {
                                            $scope.err.push({ reason: "没有楼下楼上拆迁基地对应信息", data: angular.toJson(item) })
                                        
                                        }
            
                                    })
                                    if (found < 1) {
                                        $scope.err.push({ reason: "有多个记录，但没有找到对应拆迁记录", data: angular.toJson(item) })
                                       
                                        return;
                                    }

                                }
                                
                                item.RelocationRecordId = match.RelocationRecordId
                                item.Residents = []
                                item.Residents.push(match)
                                prs.push(item)
                            })
                            $scope.gridOptions.data = prs
                            $scope.max = $scope.gridOptions.data.length;
                        })
                    })
                   
                }
                if ($scope.model.Name == 'contract') {
                    RestService.getclient('appartment').query(function (rs) {
                        var applist = rs.Items;
                        var apparray = [];
                        applist.forEach(function (app) {
                            if (apparray[app.Community.Name] == null) {
                                apparray[app.Community.Name] = []
                            }
                            if (apparray[app.Community.Name][app.BuildingNumber] == null) {
                                apparray[app.Community.Name][app.BuildingNumber] = []
                            }
                            if (apparray[app.Community.Name][app.BuildingNumber][app.DoorNumber] == null) {
                                apparray[app.Community.Name][app.BuildingNumber][app.DoorNumber] = app
                            } else {
                                $scope.err.push('dup app ' + app.Community.Name + app.BuildingNumber + app.DoorNumber)
                            }
                        })
                       
                        RestService.getclient('resident').query(function(relist) {
                            var IDprarray = []
                            var contracts = []
                            relist.Items.forEach(function (re) {
                                if (re.IdentityCard == null) {
                                    return
                                }
                                //rearray[re.IdentityCard] = re
                                if (IDprarray[re.IdentityCard.toUpperCase()] == null) {
                                    if (re.PlacementRecordId != null) {
                                       // $scope.err.push('pr ID null for ' + re.IdentityCard)
                                        IDprarray[re.IdentityCard.toUpperCase()] = re.PlacementRecordId
                                    }
                                } else if (IDprarray[re.IdentityCard.toUpperCase()] != null && re.PlacementRecordId != null) {
                                    $scope.err.push({ reason: "重复安置记录", data: angular.toJson(re) })
                               
                                }
                            })
                            $scope.gridOptions.data.forEach(function (contract) {
                                if (contract.IdentityCard_DB == null) {
                                    $scope.err.push({ reason: "没有身份证号", data: angular.toJson(contract) })
                                    return;
                                } else if (contract.IdentityCard_DB != null && contract.IdentityCard_DB.length == 15) {
                                    var tempid = contract.IdentityCard_DB.substring(0, 6) + '19' + contract.IdentityCard_DB.substring(6, 15)
                                    contract.IdentityCard_DB = tempid + validateidenttiycard(tempid)
                                } else if (contract.IdentityCard_DB != null && contract.IdentityCard_DB.length == 17) {
                                  
                                    contract.IdentityCard_DB = contract.IdentityCard_DB + validateidenttiycard(contract.IdentityCard_DB)
                                }
                                if (apparray[contract.Community_DB][contract.BuildingNumber] == null) {
                                    var a = apparray[contract.Community_DB][contract.BuildingNumber]
                                }
                                contract.AppartmentId = apparray[contract.Community_DB][contract.BuildingNumber][contract.DoorNumber].Id
                                contract.PlacementRecordId = IDprarray[contract.IdentityCard_DB.toUpperCase()]
                                if (contract.AppartmentId != null && contract.PlacementRecordId != null) {
                                    contracts.push(contract)
                                }
                                if (contract.PlacementRecordId == null || contract.PlacementRecordId == "") {
                                   
                                    $scope.err.push({ reason: "没有安置记录", data: angular.toJson(contract) })
                                }
                            })
                            $scope.gridOptions.data = contracts
                            $scope.max = $scope.gridOptions.data.length;
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

            }, function (item) {
                $scope.failure++;
                $scope.gridOptions.data[i].err = item
                $scope.err.push({ reason: "插入错误", data: angular.toJson(item) })
               
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
    $scope.$on('added', function (item) {
        var app = $filter('filter')($scope.selectedapps, { Id: item.AppartmentId })[0]
        $scope.selectedapps.splice($scope.selectedapps.indexOf(app),1)
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

    // Pagination.
    $scope.currentPage = 1;
    $scope.maxSize = 10; // How many page links shown.
    $scope.itemsPerPage = 20;

    // Cache filterstring used in query.
    var filterstring;

    $scope.pageChanged = function (showModal) {
        // Relocation records show in modal.
        $scope.rrlist = [];

        var skip = ($scope.currentPage - 1) * $scope.itemsPerPage;
        // Limit query results.
        RestService.getclient('resident').query({
            $filter: filterstring, $skip: skip,
            $top: $scope.itemsPerPage, $inlinecount: 'allpages'
        }, function (rs) {
            var residents = rs.Items;
            // Set count.
            $scope.totalItems = rs.Count;

            if (residents.length > 1) {
                residents.forEach(function (r) {
                    var rr = RestService.getclient('rr').get({ id: r.RelocationRecordId });
                    $scope.rrlist.push(rr);
                });

                // At first loading modal.
                if (showModal) {
                    var modalInstance = $modal.open({
                        templateUrl: "/pages/modal/selectRRModal.html",
                        size: 'lg',
                        controller: "SelectItemModalCtrl",
                        // In order to support paging.
                        scope: $scope
                    });
                    modalInstance.result.then(function (rr) {
                        $scope.rr = rr
                        RestService.getclient('pr').query({ $filter: "RelocationRecordId eq '" + rr.Id + "'" }, function (prs) {
                            $scope.prs = prs;
                            calculatepr(prs, RestService);
                            //$scope.contract.RelocationId = rr.RelocationId
                        });
                    }, function () {
                        // Do nothing.
                    });
                }
            }
            else if (residents.length == 1) {
                $scope.rr = RestService.getclient('rr').get({ id: residents[0].RelocationRecordId });
                RestService.getclient('pr').query({ $filter: "RelocationRecordId eq '" + residents[0].RelocationRecordId + "'" }, function (prs) {
                    $scope.prs = prs;
                    calculatepr(prs, RestService);
                    //$scope.contract.RelocationId = rr.RelocationId
                });
            }

            $scope.showresidents = true;
        });
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
            filterstring = "true";
            filters.forEach(function (f) {
                filterstring += (" and " + f)
            })

            $scope.currentPage = 1;
            $scope.pageChanged(true);
        }
    };

    $scope.clist = RestService.getclient('community').query();
    $scope.selectedapps = [];

    // Pagination for apartments.
    $scope.paging = {};
    $scope.paging.currentPage = 1;
    $scope.paging.maxSize = 10; // How many page links shown.
    $scope.paging.itemsPerPage = 20;

    // Cache filterstring used in query.
    var appFilterstring;
    $scope.paging.pageChanged = function (showModal) {
        var skip = ($scope.paging.currentPage - 1) * $scope.paging.itemsPerPage;
        // Limit query results.
        RestService.getclient('appartment').query({
            $filter: appFilterstring + " and Status ne '已售'", $orderby: 'BuildingNumber,UnitNumber,DoorNumber',
            $skip: skip, $top: $scope.paging.itemsPerPage, $inlinecount: 'allpages'
        }, function (rs) {
            $scope.applist = rs.Items;
            // Set count.
            $scope.paging.totalItems = rs.Count;

            if (showModal) {
                var modalInstance = $modal.open({
                    templateUrl: "/pages/modal/selectappModal.html",
                    size: 'lg',
                    controller: "SelectItemModalCtrl",
                    scope: $scope
                });
                modalInstance.result.then(function (item) {
                    var pr = $filter('filter')($scope.prs, { Id: $scope.contract.PlacementRecordId }, true)[0]
                    var total = 0
                    $scope.selectedapps.forEach(function (app) {
                        total += app.Size;
                    })
                    if (total + item.Size - pr.LeftSize > 50) {
                        alert("您选择的面积远超过可安置面积，不符合规定");
                        return;
                    }
                    $scope.selectedapps.push(item);
                    //$scope.contract.AppartmentId = item.Id
                    $scope.appselected = true;
                    calculateapps();
                    //initialize()
                }, function () {

                });
            }
        });
    };
    $scope.queryapp = function () {
        var filters = [];
        filters.push("CommunityId eq " + $scope.searchparams.CommunityId);
        if (($scope.searchparams.BuildingNumber != null && $scope.searchparams.BuildingNumber != "") ||
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
        appFilterstring = "true";
        filters.forEach(function (f) {
            appFilterstring += (" and " + f)
        });

        $scope.paging.currentPage = 1;
        $scope.paging.pageChanged(true);
    };

    $scope.removeselect = function (idx) {
        $scope.selectedapps.splice(idx, 1)
        calculateapps()
    }
    var calculateapps = function () {
        var pr = $filter('filter')($scope.prs, { Id: $scope.contract.PlacementRecordId }, true)[0]
        var available = pr.LeftSize
        var apps = $scope.selectedapps
        var lowest = -1
        var allsize = 0
        var totalbaseprice = 0
        var lastapp
        var lastcontract
        apps.forEach(function (app) {
            //when app is the last to calculate
            allsize += app.Size
            totalbaseprice += app.Size * app.Price1
        })
        if (available >= allsize) {
            lastapp = apps[0]
        } else {
            apps.forEach(function (app) {
                var delta = allsize - available
                var contract = {}
                contract.AppartmentId= app.Id
                contract.Appartment = app
                contract.Size1 = app.Size-delta
                contract.Size2 = delta > 5 ? 5 : delta ;
                contract.Size3 = delta > 10 ? 5 : delta -contract.Size2;
                contract.Size4 = delta  - contract.Size2 - contract.Size3;
                var total = totalbaseprice - app.Size * app.Price1 + totalprice(contract)
                if (lowest == -1 || total < lowest) {
                    lowest = total
                    lastapp = app
                    lastcontract = app
                }
            })
        }
        $scope.lastapp = lastapp
        apps.splice(apps.indexOf(lastapp),1);
        apps.push(lastapp)
        

    }   

    
    function totalprice(contract) {
        if (contract == null || contract.Appartment == null) return "N/A"
        else return contract.Appartment.Price1 * contract.Size1 +
            contract.Appartment.Price2 * contract.Size2 +
            contract.Appartment.Price3 * contract.Size3 +
            contract.Appartment.Price4 * contract.Size4
    }
    $scope.contracts = function () {
        $scope.contractlist = RestService.getclient('contract').query({ $filter: "PlacementRecordId eq " + $scope.contract.PlacementRecordId }, function () {
            $scope.showcontracts = true;
            $scope.items = $scope.contractlist
            $scope.modify = function (idx) {
                modifyitem($modal, 'contract', $scope, idx, true)
            }
            $scope.del = function (idx) {
               
                deleteitem($modal,RestService, 'contract', $scope, idx, true)
            }
        })
       
    }
    $scope.purchase = function (idx) {
        additem($modal,'contract',$scope,{
            AppartmentId: $scope.selectedapps[idx].Id,
            PlacementRecordId: $scope.contract.PlacementRecordId
        },true)
    }
    $scope.printA = function (idx) {
        window.open( "/print.html#/contracts/"+$scope.contractlist[idx].Id+"/print")
    }
    $scope.printB = function (idx) {
        window.open("/print.html#/placementrecords/" + $scope.prs[idx].Id + "/print")
    }

}]).controller('PlacementRecordCtrl', ['$scope', '$modal', 'RestService', '$filter', '$q', function ($scope, $modal, RestService, $filter, $q) {
    $scope.searchparams = {};
    $scope.rbs = RestService.getclient('rb').query();
    $scope.contract = {};
    $scope.$on("added", function (item) {
        RestService.getclient('rr').get({ id: $scope.rr.Id }, function (rr) {
            $scope.rr = rr;
            loadpr();
        });
    });
    $scope.$on("updated", function (item) {
        RestService.getclient('rr').get({ id: $scope.rr.Id }, function (rr) {
            $scope.rr = rr;
            loadpr();
        })
    });

    $scope.$on("deleted", function (item) {
        RestService.getclient('rr').get({ id: $scope.rr.Id }, function (rr) {
            $scope.rr = rr;
            loadpr();
        })
    });

    // Pagination.
    $scope.currentPage = 1;
    $scope.maxSize = 10; // How many page links shown.
    $scope.itemsPerPage = 20;

    // Cache filterstring used in query.
    var filterstring;

    $scope.pageChanged = function (showModal) {
        // Relocation records show in modal.
        $scope.rrlist = [];

        var skip = ($scope.currentPage - 1) * $scope.itemsPerPage;
        // Limit query results.
        RestService.getclient('resident').query({
            $filter: filterstring, $skip: skip,
            $top: $scope.itemsPerPage, $inlinecount: 'allpages'
        }, function (rs) {
            var residents = rs.Items;
            // Set count.
            $scope.totalItems = rs.Count;

            if (residents.length > 1) {
                residents.forEach(function (r) {
                    var rr = RestService.getclient('rr').get({ id: r.RelocationRecordId });
                    $scope.rrlist.push(rr);
                });

                // At first loading modal.
                if (showModal) {
                    var modalInstance = $modal.open({
                        templateUrl: "/pages/modal/selectRRModal.html",
                        size: 'lg',
                        controller: "SelectItemModalCtrl",
                        // In order to support paging.
                        scope: $scope
                    });
                    modalInstance.result.then(function (rr) {
                        $scope.rr = rr;
                        loadpr();
                    }, function () {
                        // Do nothing.
                    });
                }
            }
            else if (residents.length == 1) {
                RestService.getclient('rr').get({
                    id: residents[0].RelocationRecordId
                }, function (rr) {
                    $scope.rr = rr;
                    loadpr();
                });
            }
        });
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
            filterstring = "true";
            filters.forEach(function (f) {
                filterstring += (" and " + f)
            })

            $scope.currentPage = 1;
            $scope.pageChanged(true);
        }
    };

    function loadpr() {
        $scope.showresidents = true;
        $scope.items = [];

        $scope.prs = RestService.getclient('pr').query({ $filter: "RelocationRecordId eq '" + $scope.rr.Id + "'" }, function (prs) {
            calculatepr(prs, RestService);
            $scope.items = prs;
            InitCtrl($scope, $modal, 'pr', RestService, { RelocationRecordId: $scope.rr.Id });
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
    $scope.now = moment().format("YYYY-MM-DD")
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
            RestService.getclient(type).remove({ id: items[idx].Id }, function (item) {
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

function validateidenttiycard(id) {
    var arr = id.split(''), sum = 0, vc = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    for (var i = 0; i < 17; i++) sum += vc[i] * parseInt(arr[i]);
    return ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'][sum % 11];
}