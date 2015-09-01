'use strict';

/* Controllers */

var appControllers = angular.module('ms.site.controllers', ['ms.site.controllers.modal', 'ui.grid', 'ui.bootstrap']);


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
    InitCtrl($scope, $modal, 'user', RestService, { Roles: [] });

}]).controller('RBListCtrl', ['$scope', '$modal', 'RestService', function ($scope, $modal, RestService) {
    $scope.items = RestService.getclient('rb').query();
    InitCtrl($scope, $modal, 'rb', RestService, {});
}]).controller('ResidentSearchCtrl', ['$scope', '$modal', 'RestService', '$location', '$filter', function ($scope, $modal, RestService, $location, $filter) {
    // Init resident query.
    initResidentSearch($scope, RestService);

    // Pagination.
    $scope.currentPage = 1;
    $scope.maxSize = 10; // How many page links shown.
    $scope.itemsPerPage = 20;

    // Cache filterstring used in query.
    var filterstring;
    
    $scope.pageChanged = function () {
        $scope.rrlist = [];
        var skip = ($scope.currentPage - 1) * $scope.itemsPerPage;

        if ($scope.searchBy == 'rs') {
            RestService.getclient('resident').query({
                $filter: filterstring, $inlinecount: 'allpages',
                $skip: skip, $top: $scope.itemsPerPage
            }, function (residents) {
                // Set total count.
                $scope.totalItems = residents.Count;
                residents.Items.forEach(function (r) {
                    var rr = RestService.getclient('rr').get({ id: r.RelocationRecordId });
                    $scope.rrlist.push(rr);
                });
                $scope.showresult = true;
            });
        } else {
            RestService.getclient('rr').query({
                $filter: filterstring, $inlinecount: 'allpages',
                $skip: skip, $top: $scope.itemsPerPage
            }, function (result) {
                // Set total count.
                $scope.totalItems = result.Count;
                $scope.rrlist = result.Items;

                // Fill relocationbase info.
                $scope.rrlist.forEach(function (rr) {
                    rr.RelocationBase = $filter('filter')($scope.rbs, function (e) { return e.Id == rr.RelocationBaseId; }, true)[0];
                });
                $scope.showresult = true;
            });
        }
    };

    $scope.search = function () {
        filterstring = getResidentFilters($scope.searchparams, $scope.searchBy);
        
        if (filterstring.length) {
            // Search from beginning when click search button.
            $scope.currentPage = 1;
            $scope.pageChanged();
        } else {
            alert('请填写至少一项查询条件。');
        }
    };

    $scope.navtodetail = function (rr, readonly) {
        $location.path('/resident/detail/' + rr.Id + "/readonly=" + readonly);
    };

    $scope.del = function (idx) {
        $scope.items = $scope.rrlist;
        deleteitem($modal, RestService, 'rr', $scope, idx, true);
    };
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
    $scope.readonly = $routeParams.readonly
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
    $scope.edit = function () {
        //update the record

        $location.path('/resident/detail/' + $scope.rr.Id + "/readonly=false")

    }
    $scope.loadgroups = function () {
   
        $scope.glist = RestService.getclient('group').query({ $filter: "VillageId eq " + $scope.rr.Group.VillageId }, function () {
            $scope.enablegroup = true;
            $scope.rr.GroupId = null;
        })
    }
    $scope.fillid = function ($event) {
        if($scope.rr.IdentityCard.length== 17){
            $scope.rr.IdentityCard = $scope.rr.IdentityCard + validateidenttiycard($scope.rr.IdentityCard)
        }
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
    $scope.delete = function (idx) {
        RestService.getclient('rr').remove({id:$scope.items[idx].RelocationRecordId },function(){
            $scope.items[idx].Status = -1;
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
            if (!isNaN($scope.searchparams.BuildingNumber)) {
                filters.push("BuildingNumber eq " + $scope.searchparams.BuildingNumber)
            } else {
                alert('幢号只能为数字，请输入正确的幢号。');
                return;
            }
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
.controller('ResidentExportCtrl', ['$scope', 'RestService', '$filter', function ($scope, RestService, $filter) {
    // Searching.
    initResidentSearch($scope, RestService);

    $scope.model = { Name: 'rr' };
    $scope.showAllResidents = 0;

    // Table data.
    $scope.tableName = '';
    $scope.colList = [];
    $scope.cols = [];
    $scope.dataSource = [];

    // Columns need special handling.
    var residentMaster = { mResidentName: 'Name', mResidentPhone: 'Phone', mResidentIdentityCard: 'IdentityCard' };
    var dateFields = ['DateCreated', 'PaymentDate', 'DeliveryDate', 'NewVillageDate'];

    // Export templates.
    // 动迁补偿款发放明细表 TODO 扣水电费, 还水电费
    var t1 = ['RRId', 'mResidentName', 'CashPayable', 'CashPaid', 'TotalPayable', 'TotalPaid', 'TotalCompensation', 'EWFPaid', 'DepositEWF'];

    // 动拆迁情况 TODO: gender in meta, 标准
    var t2 = ['RelocationBase', 'RRId', 'mResidentName', 'mResidentPhone', 'Name', 'IdentityCard', 'RelationshipType', 'Village', 'Group', 'DeliveryDate', 'ResidentsCount', 'RelocationType'];

    // xxx基地动迁面积及补偿金额汇总表
    var t3 = ['RRId', 'mResidentName', 'MeasuredSize', 'EffectiveSize', 'TotalCompensation'];

    // xxx基地评估总面积汇总表
    var t4 = ['RRId', 'mResidentName', 'MeasuredSize'];

    // 动迁户人口及房屋有效面积认定汇总表
    var t5 = ['RRId', 'mResidentName', 'ResidentsCount', 'MeasuredSize', 'EffectiveSize', 'NoConstructionSize', 'UncertifiedSize'];

    // 过渡费发放汇总表
    var t6 = ['RRId', 'mResidentName', 'EffectiveSize', 'DeliveryDate', 'TransitionFee'];

    // xxx基地拆迁户付款汇总表 TODO 银行存单
    var t7 = ['RRId', 'mResidentName', 'mResidentIdentityCard', 'CashPaid'];

    // xxx基地兑换安置房金额转入新村办清册
    var t8 = ['RRId', 'Name', 'TotalCompensation'];

    // xxx基地动迁户水电费情况 TODO 还水电费
    var t9 = ['RRId', 'mResidentName', 'EWAmount', 'DepositEWF', 'EWFPaid'];

    // xxx基地安置面积汇总表
    var t10 = ['RRId', 'mResidentName', 'RelocationSize'];

    // xxx基地大病补助汇总表
    var t11 = ['RRId', 'mResidentName', 'SickCompensation'];

    $scope.exportTmpls = [
        { id: '1', name: '动迁补偿款发放明细表', lst: t1 },
        { id: '2', name: '动拆迁情况', lst: t2 },
        { id: '3', name: '动迁面积及补偿金额汇总表', lst: t3 },
        { id: '4', name: '评估总面积汇总表', lst: t4 },
        { id: '5', name: '动迁户人口及房屋有效面积认定汇总表', lst: t5 },
        { id: '6', name: '过渡费发放汇总表', lst: t6 },
        { id: '7', name: '拆迁户付款汇总表', lst: t7 },
        { id: '8', name: '兑换安置房金额转入新村办清册', lst: t8 },
        { id: '9', name: '动迁户水电费情况', lst: t9 },
        { id: '10', name: '安置面积汇总表', lst: t10 },
        { id: '11', name: '大病补助汇总表', lst: t11 }
    ];

    // Load column metadata.
    RestService.getclient('header').query({ $filter: "ModelName eq 'resident'" }, function (result) {
        $scope.residentsHeader = result;

        RestService.getclient('header').query({
            $filter: "ModelName eq '" + $scope.model.Name + "'"
        }, function (meta) {
            meta.forEach(function (m) {
                // Skip Id.
                if (m.Field.toLowerCase() == "id") return;

                $scope.colList.push({
                    name: m.Field,
                    displayName: m.Name,
                    visible: true
                });
            });

            // Add resident master fields.
            for (var rf in residentMaster) {
                var rh = $filter('filter')($scope.residentsHeader, { Field: residentMaster[rf] }, true)[0];

                $scope.colList.push({
                    name: rf,
                    displayName: '户主' + rh.Name,
                    visible: true
                });
            };

            // Add resident fields.
            $scope.residentsHeader.forEach(function (r) {
                // Skip Id.
                if (r.Field.toLowerCase() == "id" || r.Field.toLowerCase().indexOf('recordid') >= 0) return;

                $scope.colList.push({
                    name: r.Field,
                    displayName: r.Name,
                    visible: true
                });
            });

            // Add person count field.
            $scope.colList.push({
                name: 'ResidentsCount',
                displayName: '家庭人数',
                visible: true
            });
        });
    });

    var getRelocationBase = function (baseId) {
        var rbase = $filter('filter')($scope.rbs, function (e) { return e.Id == baseId; }, true)[0];
        return rbase != null ? rbase.Name : null;
    };

    var prepareData = function (rr) {
        var mapped = angular.copy(rr);

        // Handle relocation base.
        mapped.RelocationBase = getRelocationBase(rr.RelocationBaseId);

        // Convert date to from UTC to locale.
        dateFields.forEach(function (d) {
            mapped[d] = $filter('date')(mapped[d], 'yyyy-MM-dd');
        });

        // Whether show all residents.
        if ($scope.showAllResidents == '1' && mapped.Residents.length > 1) {
            mapped.Residents.forEach(function (r) {
                var mapped2 = angular.copy(mapped);

                // Add resident record.
                $scope.residentsHeader.forEach(function (rh) {
                    mapped2[rh.Field] = r[rh.Field];
                });

                // Add resident master.
                for (var rf in residentMaster) {
                    mapped2[rf] = mapped.Residents[0][residentMaster[rf]];
                }

                mapped2.ResidentsCount = mapped.Residents.length;

                delete mapped2.Residents;
                $scope.dataSource.push(mapped2);
            });
        } else {
            // Add resident record.
            $scope.residentsHeader.forEach(function (rh) {
                mapped[rh.Field] = mapped.Residents[0][rh.Field];
            });

            // Add resident master.
            for (var rf in residentMaster) {
                mapped[rf] = mapped.Residents[0][residentMaster[rf]];
            }

            mapped.ResidentsCount = mapped.Residents.length;

            delete mapped.Residents;
            $scope.dataSource.push(mapped);
        }
    };

    var buildTableName = function () {
        // Build table name.
        var tableName = '';
        if ($scope.searchparams.RelocationBaseId != null && $scope.searchparams.RelocationBaseId != '') {
            tableName += getRelocationBase($scope.searchparams.RelocationBaseId) + '基地';
        }

        if ($scope.selectedTmpl == '' || $scope.selectedTmpl == null) {
            tableName += '动迁记录';
        } else {
            tableName += $scope.selectedTmpl.name;
        }

        $scope.tableName = tableName;
    };

    // Load table data.
    $scope.search = function () {
        // Build table name.
        buildTableName();

        if ($scope.cols.length == 0) {
            $scope.cols = $scope.colList;
        }

        $scope.dataSource = [];
        var filterstring = getResidentFilters($scope.searchparams, 'rr');

        RestService.getclient('rr').query({ $filter: filterstring }, function (result) {
            result.Items.forEach(function (item) {
                prepareData(item);
            });
        });
    };

    // Load template data.
    $scope.loadTmpl = function () {
        if ($scope.selectedTmpl == '') {
            $scope.cols = $scope.colList;
            return;
        }

        // Build table name.
        buildTableName();

        // Build new cols.
        var selectedCols = [];
        $scope.selectedTmpl.lst.forEach(function (field) {
            selectedCols.push($filter('filter')($scope.colList, {name: field}, true)[0]);
        });
        $scope.cols = selectedCols;
    };
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
                                var rr = $filter('filter')(list_temp, { RelocationBase_t: item.RelocationBase_t, RRId: item.RRId, OwnerName_t: item.OwnerName_t }, true)[0]
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
                        RestService.getclient('rr').query(function (result) {
                            var rrarray = [], rrs = result.Items;
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
                                //找到Pr记录中对应身份证号码的Resident
                                var match = null;
                                if (rs == null || rs.length == 0) {
                                    $scope.err.push({ reason: "没有对应拆迁记录", data: angular.toJson(item) })
                                  
                                    return
                                } else if (rs.length == 1) { //只找到一个Residents
                                    match = rs[0]
                                }
                                else if (rs.length > 1) {//找到多个Resident,则根据拆迁基地来找到唯一记录
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
                                            }//寻找到补偿金额较大的记录，因为有可能超过10个人以后进行分户
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
                        applist.forEach(function (app) {//生成一个APP的列表，用来根据条件快速查询
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
                            var IDprarray = []//构造PR列表，可根据身份证号快速查询
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
                                    $scope.err.push({ reason: "重复安置记录", data: angular.toJson(re) })//一个人具有两个安置记录，仅保留第一个安置记录
                               
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
                                if (contract.PlacementRecordId == null || contract.PlacementRecordId == "") {

                                    $scope.err.push({ reason: "没有安置记录", data: angular.toJson(contract) })

                                    return
                                }
                                else if (contract.AppartmentId != null && contract.PlacementRecordId != null) {
                                    
                                    if ((contract.AppartmentOwnerName != null && contract.AppartmentOwnerName!='')
                                        || (contract.AppartmentOwnerId!=null &&contract.AppartmentOwnerId!='')){
                                        contract.AppartmentOwners = []
                                        var ao = {}
                                        ao.Name = contract.AppartmentOwnerName
                                        ao.IdentityCard = contract.AppartmentOwnerId
                                        ao.ShowAsOwner = true
                                        ao.ShowOnCert = false
                                        contract.AppartmentOwners.push(ao)
                                    }
                                    contracts.push(contract)
                                }
                            })
                            $scope.gridOptions.data = contracts
                            $scope.max = $scope.gridOptions.data.length;
                        })

                       
                    })     
                }
                if ($scope.model.Name == 'ao') {
                    RestService.getclient('appartment').query(function (rs) {
                        var applist = rs.Items;
                        var apparray = [];
                        applist.forEach(function (app) {//生成一个APP的列表，用来根据条件快速查询
                            if (apparray[app.Community.Name] == null) {
                                apparray[app.Community.Name] = []
                            }
                            if (apparray[app.Community.Name][app.BuildingNumber] == null) {
                                apparray[app.Community.Name][app.BuildingNumber] = []
                            }
                            if (apparray[app.Community.Name][app.BuildingNumber][app.DoorNumber] == null) {
                                apparray[app.Community.Name][app.BuildingNumber][app.DoorNumber] = app.Id
                            } else {
                                $scope.err.push('dup app ' + app.Community.Name + app.BuildingNumber + app.DoorNumber)
                            }
                        })
                       
                        RestService.getclient('contract').query(function (clist) {
                            var aos = []
                            var appcarray = []
                            clist.forEach(function(c){
                                appcarray[c.AppartmentId] = c.Id
                            })
                            $scope.gridOptions.data.forEach(function (ao) {
                                ao.ContractId = appcarray[apparray[ao.Community_DB][ao.BuildingNumber][ao.DoorNumber]]
                                ao.Name = ao.CertOwnerName_t
                                ao.IdentityCard = ao.CertOwnerId_t
                                ao.ShowOnCert = true
                                ao.ShowAsOwner = false
                                aos.push(ao)
                            })
                            $scope.gridOptions.data = aos
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
                
                $scope.err.push({ reason: "插入错误", data: angular.toJson(item) })
               
                $scope.dynamic++
                if ($scope.dynamic >= $scope.max) {
                    $scope.adding = false;
                    $interval.cancel(timer)
                }
            })
            i++
            
        }, 30);

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
  

}]).controller('ContractCtrl', ['$scope', '$modal', 'RestService', '$filter', '$cookies', function ($scope, $modal, RestService, $filter, $cookies) {
    $scope.searchparams = {};

    // Load search key last time from cookie.
    if ($cookies.pr_search != null) {
        $scope.searchparams.Name = $cookies.pr_search;
    }

   // $scope.rbs = RestService.getclient('rb').query()
    $scope.contract = {}
    $scope.$on('added', function ($event,item) {
        var app = $filter('filter')($scope.selectedapps, { Id: item.AppartmentId })[0]
        $scope.selectedapps.splice($scope.selectedapps.indexOf(app),1)
        reloadpr()
    })
    $scope.$on('deleted', function ($event, item) {
        reloadpr()
    })
    $scope.$on('updated', function ($event, item) {
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
    $scope.itemsPerPage = 10;

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
        filters.push("RelationshipType eq '户主' and Status eq 1")

        // Save search key in cookie.
        if ($scope.searchparams.Name != null && $scope.searchparams.Name.trim() != '') {
            $cookies.pr_search = $scope.searchparams.Name;
        }

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

            if (rs.Count == 0) {
                return;
            }

            if (showModal) {
                var modalInstance = $modal.open({
                    templateUrl: "/pages/modal/selectappModal.html",
                    size: 'lg',
                    controller: "SelectItemModalCtrl",
                    scope: $scope
                });
                modalInstance.result.then(function (item) {
                    var pr = $filter('filter')($scope.prs, { Id: $scope.contract.PlacementRecordId }, true)[0];
                    var total = 0;
                    // Whether selected same apartment.
                    $scope.appduplicated = false;

                    $scope.selectedapps.forEach(function (app) {
                        if (app.Id == item.Id) {
                            $scope.appduplicated = true;
                        }
                        total += app.Size;
                    });

                    if ($scope.appduplicated) {
                        return;
                    }

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
        if (($scope.searchparams.BuildingNumber != null && $scope.searchparams.BuildingNumber.trim() != "") ||
            ($scope.searchparams.SizeRange != null && $scope.searchparams.SizeRange)) {

            if ($scope.searchparams.BuildingNumber != null && $scope.searchparams.BuildingNumber.trim() != "") {
                if (!isNaN($scope.searchparams.BuildingNumber)) {
                    filters.push("BuildingNumber eq " + $scope.searchparams.BuildingNumber);
                } else {
                    alert('幢号只能为数字，请输入正确的幢号。');
                    return;
                }
            }
            if ($scope.searchparams.SizeRange != null && $scope.searchparams.SizeRange != "") {
                if ($scope.searchparams.SizeRange == 1) {
                    filters.push("Size lt 60");
                }
                else if ($scope.searchparams.SizeRange == 2) {
                    filters.push("(Size ge 60 and Size le 90)");
                }
                else if ($scope.searchparams.SizeRange == 3) {
                    filters.push("Size gt 90");
                }

            }
        }
        appFilterstring = "true";
        filters.forEach(function (f) {
            appFilterstring += (" and " + f);
        });

        $scope.paging.currentPage = 1;
        $scope.paging.pageChanged(true);
    };

    $scope.removeselect = function (idx) {
        $scope.selectedapps.splice(idx, 1);
        if ($scope.selectedapps.length) {
            calculateapps();
        }
    }
    var calculateapps = function () {
        var pr = $filter('filter')($scope.prs, { Id: $scope.contract.PlacementRecordId }, true)[0];
        var available = pr.LeftSize;
        var apps = $scope.selectedapps;
        var lowest = -1, allsize = 0, totalbaseprice = 0;
        var lastapp, lastcontract;
        apps.forEach(function (app) {
            //when app is the last to calculate
            allsize += app.Size;
            totalbaseprice += app.Size * app.Price1;
        });
        if (available >= allsize) {
            lastapp = apps[0];
        } else {
            apps.forEach(function (app) {
                var delta = allsize - available;
                var contract = {};
                contract.AppartmentId = app.Id;
                contract.Appartment = app;
                contract.Size1 = app.Size - delta;
                contract.Size2 = delta > 5 ? 5 : delta;
                contract.Size3 = delta > 10 ? 5 : delta - contract.Size2;
                contract.Size4 = delta - contract.Size2 - contract.Size3;
                var total = totalbaseprice - app.Size * app.Price1 + totalprice(contract);
                if (lowest == -1 || total < lowest) {
                    lowest = total;
                    lastapp = app;
                    lastcontract = app;
                }
            });
        }
        $scope.lastapp = lastapp;
        apps.splice(apps.indexOf(lastapp), 1);
        apps.push(lastapp);
    }
    
    function totalprice(contract) {
        if (contract == null || contract.Appartment == null) return "N/A"
        else return contract.Appartment.Price1 * contract.Size1 +
            contract.Appartment.Price2 * contract.Size2 +
            contract.Appartment.Price3 * contract.Size3 +
            contract.Appartment.Price4 * contract.Size4
    }
    $scope.contracts = function () {
        $scope.contractlist = RestService.getclient('contract').query({ $filter: "PlacementRecordId eq " + $scope.contract.PlacementRecordId, $orderby: "Id" }, function () {
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
        window.open("/print.html#/placementrecords/"+ $scope.contract.PlacementRecordId+"/contracts/" + $scope.contractlist[idx].Id + "/printconfirmation")
    }
    $scope.printB = function (idx) {
        window.open("/print.html#/placementrecords/" + $scope.prs[idx].Id + "/printrecords")
    }
    $scope.printC = function (idx) {
        window.open("/print.html#/placementrecords/" + $scope.contract.PlacementRecordId + "/contracts/" + $scope.contractlist[idx].Id + "/printrecord")
    }

}])
.controller('ContractExportCtrl', ['$scope', 'RestService', '$filter', '$q', function ($scope, RestService, $filter, $q) {
    $scope.rbs = RestService.getclient('rb').query();
    $scope.clist = RestService.getclient('community').query();

    $scope.searchparams = {};
    $scope.contracts = [];

    // Table data.
    $scope.tableName = '购房信息';

    // TODO headers for pr need to update.
    $scope.cols = [
        { name: 'CommunityName', displayName: '小区', visible: true },
        { name: 'BuildingNumber', displayName: '单元号', visible: true },
        { name: 'DoorNumber', displayName: '室号', visible: true },
        { name: 'Size', displayName: '面积', visible: true },
        { name: 'TotalPrice', displayName: '总价格', visible: true },
        { name: 'Status', displayName: '状态', visible: true },
        { name: 'Owners', displayName: '房主', visible: true },
        { name: 'PaymentAmount', displayName: '购房金额', visible: true },
        { name: 'DeltaAmount', displayName: '购房差额款', visible: true }
    ];

    var prepareData = function (contract, owners) {
        contract.CommunityName = contract.Appartment.Community.Name;
        contract.BuildingNumber = contract.Appartment.BuildingNumber;
        contract.DoorNumber = contract.Appartment.DoorNumber;
        contract.Size = contract.Appartment.Size;
        contract.TotalPrice = contract.Appartment.TotalPrice;
        contract.Status = contract.Appartment.Status;

        contract.Owners = owners;
    };

    // Load rr at first.
    $scope.search = function () {
        $scope.contracts = [];

        var rbFilter = '', appFilters = [], appFiltersObj = {};
        if ($scope.searchparams.RelocationBaseId != '' && $scope.searchparams.RelocationBaseId != null) {
            rbFilter = $scope.searchparams.RelocationBaseId;
        }

        if ($scope.searchparams.CommunityId != '' && $scope.searchparams.CommunityId != null) {
            appFilters.push("CommunityId eq " + $scope.searchparams.CommunityId);
            appFiltersObj.CommunityId = parseInt($scope.searchparams.CommunityId);
        }

        if ($scope.searchparams.BuildingNumber != null && $scope.searchparams.BuildingNumber.trim() != '') {
            if (!isNaN($scope.searchparams.BuildingNumber)) {
                appFilters.push("BuildingNumber eq " + $scope.searchparams.BuildingNumber);
                appFiltersObj.BuildingNumber = parseInt($scope.searchparams.BuildingNumber);
            }
        }

        // TODO contract inside app should be 1? Is this extra?
        if ($scope.searchparams.Status != null && $scope.searchparams.Status != '') {
            if ($scope.searchparams.Status == 0) {
                appFilters.push("Status eq '可售'");
                appFiltersObj.Status = '可售';
            }
            else if ($scope.searchparams.Status == 1) {
                appFilters.push("Status eq '已售'");
                appFiltersObj.Status = '已售';
            }
        }

        if (rbFilter == '' && appFilters.length == 0) {
            alert('请输入至少一项查询条件。');
            return;
        }

        // Query rb -> rr -> pr.
        if (rbFilter != '') {
            // Query rr. TODO RelocationRecord status eq 1
            RestService.getclient('rr').query({ $filter: 'Status eq 1 and RelocationBaseId eq ' + rbFilter }, function (result) {
                // Query pr by rr batch.
                var filters = queryByBatch(result.Items, 'Id', 'RelocationRecordId', true);
                filters.forEach(function (f) {
                    RestService.getclient('pr').query({ $filter: f }, function (prs) {
                        // Query contract by pr batch.
                        var filters = queryByBatch(prs, 'Id', 'PlacementRecordId', false);

                        filters.forEach(function (f) {
                            RestService.getclient('contract').query({ $filter: f, $orderby: "Id" }, function (contracts) {
                                contracts.forEach(function (con) {
                                    // Filter by appartment.
                                    var matched = true;
                                    for (var f in appFiltersObj) {
                                        if (con.Appartment[f] != appFiltersObj[f]) {
                                            matched = false;
                                            break;
                                        }
                                    }

                                    if (matched) {
                                        // Get owners.
                                        var pr = $filter('filter')(prs, { Id: con.PlacementRecordId }, true)[0];
                                        prepareData(con, pr.Name);
                                        $scope.contracts.push(con);
                                    }
                                });
                            });
                        });
                    });
                });
            });
        }
        else if (appFilters.length) {
            var filterstring = "true";
            appFilters.forEach(function (f) {
                filterstring += (" and " + f)
            });

            // Cache pr id -> name.
            var prCache = {};

            RestService.getclient('appartment').query({ $filter: filterstring }, function (result) {
                var filters = queryByBatch(result.Items, 'Id', 'AppartmentId', false);

                filters.forEach(function (f) {
                    RestService.getclient('contract').query({ $filter: f }, function (cons) {
                        cons.forEach(function (con) {
                            if (!prCache.hasOwnProperty(con.PlacementRecordId)) {
                                RestService.getclient('pr').get({ id: con.PlacementRecordId }, function (pr) {
                                    prCache[con.PlacementRecordId] = pr.Name;

                                    prepareData(con, pr.Name);
                                    $scope.contracts.push(con);
                                });
                            } else {
                                prepareData(con, prCache[con.PlacementRecordId]);
                                $scope.contracts.push(con);
                            }
                        });
                    });
                });
            });
        }
    };

}])
.controller('PlacementExportCtrl', ['$scope', 'RestService', '$filter', function ($scope, RestService, $filter) {
    $scope.rbs = RestService.getclient('rb').query();
    $scope.searchparams = {};
    $scope.prList = [];

    // Table data.
    $scope.tableName = '安置信息';

    // TODO headers for pr need to update.
    $scope.cols = [
        { name: 'Name', displayName: '人员', visible: true },
        { name: 'RelocationBase', displayName: '动迁基地', visible: true },
        { name: 'Size', displayName: '可安置面积', visible: true },
        { name: 'UsedSize', displayName: '已安置面积', visible: true },
        { name: 'ApprovedSize', displayName: '有证面积', visible: true },
        { name: 'TotalCompensation', displayName: '安置补偿款', visible: true },
        { name: 'UsedAmount', displayName: '已使用安置补偿款', visible: true },
        { name: 'AppartmentCount', displayName: '购房个数', visible: true }
    ];

    // Load rr at first.
    $scope.search = function () {
        if ($scope.searchparams.RelocationBaseId == '' || $scope.searchparams.RelocationBaseId == null) {
            alert('请选择动迁基地。');
            return;
        }
        
        $scope.prList = [];

        var relocationBase = $filter('filter')($scope.rbs, function (e) { return e.Id == $scope.searchparams.RelocationBaseId; }, true)[0];

        // TODO RelocationRecord status eq 1
        RestService.getclient('rr').query({ $filter: 'Status eq 1 and RelocationBaseId eq ' + $scope.searchparams.RelocationBaseId }, function (result) {
            // Query pr by batch. related to 'MaxNodeCount' in backend controller.
            var filters = queryByBatch(result.Items, 'RelocationRecordId', true);

            filters.forEach(function (f) {
                RestService.getclient('pr').query({ $filter: f }, function (prs) {
                    prs.forEach(function (pr) {
                        pr.RelocationBase = relocationBase.Name;
                        $scope.prList.push(pr);
                    });
                });
            });
        });
    };

}])
.controller('PlacementRecordCtrl', ['$scope', '$modal', 'RestService', '$filter', '$cookies', function ($scope, $modal, RestService, $filter, $cookies) {
    $scope.searchparams = {};

    // Load search key last time from cookie.
    if ($cookies.pr_search != null) {
        $scope.searchparams.Name = $cookies.pr_search;
    }

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
    $scope.itemsPerPage = 10;

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
        // Save search key in cookie.
        if ($scope.searchparams.Name != null && $scope.searchparams.Name.trim() != '') {
            $cookies.pr_search = $scope.searchparams.Name;
        }

        var filters = [];
        filters.push("RelationshipType eq '户主' and Status eq 1")
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
/*.controller('PrintACtrl', ['$scope', '$modal', 'RestService', '$routeParams', function ($scope, $modal, RestService, $routeParams) {
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
        $scope.pr = item.PlacementRecord;
        $scope.contracts = RestService.getclient('contract').query({ $filter: "PlacementRecordId eq " + $scope.pr.Id, $orderby: "Id" }, function (contracts) {
            contracts.forEach(function (contract) {

            })
        })
    })


    $scope.totalprice = function () {
        if($scope.contract == null || $scope.contract.Appartment==null) return "N/A"
        else return $scope.contract.Appartment.Price1 * $scope.contract.Size1+　
            $scope.contract.Appartment.Price2 * $scope.contract.Size2 + 
            $scope.contract.Appartment.Price3 * $scope.contract.Size3 + 
            $scope.contract.Appartment.Price4 * $scope.contract.Size4
    }
}])*/.controller('PrintBCtrl', ['$scope', '$modal', 'RestService', '$routeParams','$filter', function ($scope, $modal, RestService, $routeParams, $filter) {
    var prid = $routeParams.prid
    var cid = $routeParams.cid
    $scope.showrecord = function (idx) {
        if (cid == null) {
            return true;
        } else {
            if ($scope.idx == null) {
                return false
            } else {
                return $scope.idx == idx
            }
        }
    }
    $scope.now = moment().format("YYYY-MM-DD")
    $scope.pr = RestService.getclient('pr').get({ id: prid }, function (pr) {
        $scope.contracts = RestService.getclient('contract').query({ $filter: "PlacementRecordId eq " + pr.Id, $orderby: "Id" }, function (contracts) {
            if (cid != null) {
                var i = 0;
                contracts.forEach(function (c){
                    if (c.Id == cid) {
                       // $scope.contract = c
                        $scope.idx = i
                    }
                    i++
                })
                $scope.ctotalprice = $scope.totalprice($scope.idx).toFixed(2)
                $scope.cdelta = $scope.delta($scope.idx).toFixed(2)
                $scope.cusedamount = $scope.usedamount($scope.idx).toFixed(2)
                $scope.contract = RestService.getclient('contract').get({ id: cid }, function (item) {
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
                    item.AppartmentOwners = $filter('filter')(item.AppartmentOwners,{ShowOnCert:true},true)
                    while (item.AppartmentOwners.length < 6) {
                        item.AppartmentOwners.push({})
                    }
                    $scope.pr = item.PlacementRecord;
                    $scope.contracts = RestService.getclient('contract').query({ $filter: "PlacementRecordId eq " + $scope.pr.Id, $orderby: "Id" }, function (contracts) {
                        contracts.forEach(function (contract) {

                        })
                    })
                })
            }
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
    $scope.usedamount = function (idx) {
        if (idx == 0) {
            return $scope.pr.TotalCompensation - $scope.totalprice(0) > 0 ? $scope.totalprice(0) : $scope.pr.TotalCompensation
        } else {
            var totalused = 0
            var i = idx
            while (i > 0) {
                totalused += $scope.usedamount(i-1)
                i--
            }
            return $scope.pr.TotalCompensation - totalused - $scope.totalprice(idx) > 0 ?$scope.totalprice(idx): $scope.pr.TotalCompensation - totalused
        }
    }
    $scope.delta = function (idx) {
        return $scope.totalprice(idx) - $scope.usedamount(idx)
    }
    $scope.totalfee = function (idx) {
        var contract = $scope.contracts[idx]
        return  contract.GasFee + contract.OtherFee - contract.TransitionFee + contract.TVFee - contract.InterestFee + contract.RepairUnitPrice * contract.Appartment.Size + contract.DeltaAmount
    }
    $scope.owners = function (idx) {
        var contract = $scope.contracts[idx]
        var owner = $filter('filter')(contract.AppartmentOwners, { ShowAsOwner: true }, true)[0]
        if (owner != null) {
            return $filter('filter')(contract.AppartmentOwners, { ShowAsOwner: true }, true)[0].Name
        }
        return ""
        
    }
    $scope.idcard = function (idx) {
        var contract = $scope.contracts[idx]
        if (contract.AppartmentOwners != null) {
            var owner =$filter('filter')(contract.AppartmentOwners, { ShowAsOwner: true }, true)[0]
            if(owner!= null){
                return $filter('filter')(contract.AppartmentOwners, { ShowAsOwner: true }, true)[0].IdentityCard
            }
            
        }
        return ""
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

function initResidentSearch($scope, RestService) {
    // Load rb and village.
    $scope.rbs = RestService.getclient('rb').query();
    $scope.vlist = RestService.getclient('village').query();

    // Datepickers.
    InitDataPicker($scope);

    // Searching.
    $scope.searchparams = {};
    // Flag whether search by resident (rs) or relocationrecord (rr).
    $scope.searchBy = 'rs';
    $scope.searchByChanged = function (by) {
        $scope.searchBy = by;
    };
}

function getResidentFilters(params, searchBy) {
    var filters = { rs: [], rr: [] };

    // Filters by resident.
    if (params.Name != null && params.Name.trim() != '') {
        filters.rs.push("substringof('" + params.Name + "',Name)")
    }
    if (params.IdentityCard != null && params.IdentityCard.trim() != '') {
        filters.rs.push("substringof('" + params.IdentityCard + "',IdentityCard)")
    }

    // Filters by relocationrecord.
    if (params.RelocationBaseId != null && params.RelocationBaseId != '') {
        filters.rr.push('RelocationBaseId eq ' + params.RelocationBaseId);
    }
    if (params.RRId != null && params.RRId.trim() != '') {
        filters.rr.push("RRId eq '" + params.RRId + "'");
    }
    if (params.Village != null && params.Village.trim() != '') {
        filters.rr.push("Village eq '" + params.Village + "'");
    }
    if (params.Group != null && params.Group.trim() != '') {
        filters.rr.push("Group eq '" + params.Group + "'");
    }
    if (params.DoorNumber != null && params.DoorNumber.trim() != '') {
        filters.rr.push("DoorNumber eq '" + params.DoorNumber + "'");
    }
    if (params.PaymentDateStart != null) {
        filters.rr.push('PaymentDate ge ' + "datetime'" + params.PaymentDateStart.toISOString() + "'");
    }
    if (params.PaymentDateEnd != null) {
        filters.rr.push('PaymentDate le ' + "datetime'" + params.PaymentDateEnd.toISOString() + "'");
    }
    if (params.DeliveryDateStart != null) {
        filters.rr.push('DeliveryDate ge ' + "datetime'" + params.DeliveryDateStart.toISOString() + "'");
    }
    if (params.DeliveryDateEnd != null) {
        filters.rr.push('DeliveryDate le ' + "datetime'" + params.DeliveryDateEnd.toISOString() + "'");
    }

    var filterstring = '';

    if (filters.rs.length || filters.rr.length) {
        // Reset filterstring occording to current filters.
        filterstring = searchBy == 'rs' ? "Status eq 1" : "Status eq 1";

        filters[searchBy].forEach(function (f) {
            filterstring += (" and " + f);
        });
    }

    return filterstring;
}

function queryByBatch(idArr, idAttr, idField, fieldIsStr) {
    // Query pr by batch. related to 'MaxNodeCount' in backend controller.
    var batchSize = 39;
    var batch = Math.ceil(idArr.length / batchSize);
    var filters = [];

    var i, j, k, filterstring;
    for (i = 1; i <= batch; i++) {
        filterstring = 'false';
        k = Math.min(i * batchSize, idArr.length);

        for (j = (i - 1) * batchSize; j < k; j++) {
            if (fieldIsStr) {
                filterstring += " or " + idField + " eq '" + idArr[j][idAttr] + "'";
            } else {
                filterstring += " or " + idField + " eq " + idArr[j][idAttr];
            }
        }

        filters.push(filterstring);
    }

    return filters;
}
