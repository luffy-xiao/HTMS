'use strict';

/* Controllers */

var appControllers = angular.module('ms.site.controllers.modal',['ms.site.services']);

appControllers.controller('LoginModalCtrl', ['$scope', 'UserService', '$modalInstance', function ($scope, UserService, $modalInstance) {

    $scope.error = false;
    $scope.login = function () {
        UserService.login($scope.username, $scope.password, function () {
            $modalInstance.close()
        }, function () {
            $scope.error = true;
        })
        
    };
    $scope.$on('user_changed', function (event, data) {
        if(data!=null)
           $modalInstance.close()
    })

}]).controller('SaveUserModalCtrl', ['$scope', 'UserService', '$modalInstance', function ($scope, UserService, $modalInstance) {
    $scope.adduser = function () {
        $scope.newuser.Roles = []
        $scope.newuser.Roles.push({ Id: $scope.roleid })
       
        UserService.create($scope.newuser)
        $modalInstance.close($scope.newuser)
    };
    $scope.cancel = function () {
        $modalInstance.dismiss()
    };

}]).controller('ResetPasswordModalCtrl', ['$scope', '$http', '$modalInstance', 'item', function ($scope, $http, $modalInstance, item) {
    $scope.item = item;
    $scope.ok = function () {
        var pData = {
            UserId: $scope.item.Id,
            NewPassword: $scope.NewPassword,
            ConfirmPassword: $scope.ConfirmPassword
        };
        
        $http.post("/api/Account/ResetPassword", pData).success(function (data) {
            alert('重置密码成功。');
        }).error(function (error) {
            alert(angular.toJson(error));
        });

        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]).controller('ConfirmModalCtrl', ['$scope', 'UserService', '$modalInstance', function ($scope, UserService, $modalInstance) {
    $scope.ok = function () {
        $modalInstance.close()
    };
    $scope.cancel = function () {
        $modalInstance.dismiss()
    };
}]).controller('SelectItemModalCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
    $scope.tip = '';
    $scope.ok = function () {
        if ($scope.selected == null) {
            $scope.tip = '请选择一条记录。';
        } else {
            $modalInstance.close($scope.selected);
        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]).controller('SaveItemModalCtrl', ['$scope', 'RestService', '$modalInstance', 'type', 'item', 'commit', '$filter', function ($scope, RestService, $modalInstance, type, item, commit, $filter) {
    InitDataPicker($scope);
    if (type == 'appartment') {
        $scope.ftypes = RestService.getclient('ftype').query();
        $scope.apptypes = RestService.getclient('apptype').query();
        $scope.dtypes = RestService.getclient('dtype').query();
    }
    if (type == 'resident') {
        RestService.getclient('rt').query({}, function (ret) {
            if (item.RelationshipType == null) {
                $scope.rts = [{'Name': '户主'}].concat(ret);
            } else {
                $scope.rts = ret;
            }
        });
    }

    $scope.newitem = angular.copy(item);
    if (type == 'pr') {
        if (item.Id != null) {//modify item, show the residents in the record
            $scope.rr = {}
            $scope.rr.Residents = item.Residents
            $scope.rr.Residents.forEach(function (r) {
                r.selected = true
            })
        } else {// new record, show the residents can be selected
            $scope.rr = RestService.getclient('rr').get({ id: item.RelocationRecordId }, function (rr) {
                rr.Residents = $filter('filter')(rr.Residents, function (value) {
                    value.selected = true;
                    return value.PlacementRecordId == null;
                })
                rr.PlacementRecords = RestService.getclient('pr').query({ $filter: "RelocationRecordId eq '" + rr.Id + "'" }, function (prs) {
                    var allocatedsize = 0;
                    var allocatedcompensation = 0;
                    var allocatedapprovedsize = 0;

                    prs.forEach(function (pr) {
                        allocatedsize += pr.Size;
                        allocatedcompensation += pr.TotalCompensation;
                        allocatedapprovedsize += pr.ApprovedSize;
                    })
                    $scope.newitem.Size = rr.RelocationSize - allocatedsize;
                    $scope.newitem.TotalCompensation = rr.TotalCompensation - allocatedcompensation;
                    $scope.newitem.ApprovedSize = rr.ApprovedSize - allocatedapprovedsize;

                    // Set default RepurchasePrice as in relocationbase.
                    $scope.newitem.RepurchasePrice = rr.RelocationBase.RepurchasePrice;
                });
            });
        }

    }

    // Contract modal.
    if (type == 'contract') {
        if ($scope.newitem.Status == null) {
            $scope.newitem.Status = ''
        }
        $scope.app = RestService.getclient('appartment').get({ id: $scope.newitem.AppartmentId }, function (app) {
            $scope.pr = RestService.getclient('pr').get({ id: $scope.newitem.PlacementRecordId }, function (pr) {
                RestService.getclient('rr').get({ Id: pr.RelocationRecordId }, function (rr) {
                    var total = 0
                    var size = 0;
                    
                    // Handle floating digits.
                    var available = parseFloat((pr.Size - pr.UsedSize).toFixed(2));
                       
                    if (item.Id == null) {
                        $scope.newitem.AppartmentOwners = pr.Residents;
                        $scope.newitem.AppartmentOwners.forEach(function (ao) {
                            delete ao['Id']
                        })
                        
                        if (available < 0) available = 0
                        $scope.newitem.Size1 = available >= app.Size ? app.Size : available
                        $scope.newitem.Size2 = app.Size - $scope.newitem.Size1 > 5 ? 5 : app.Size - $scope.newitem.Size1
                        $scope.newitem.Size3 = app.Size - $scope.newitem.Size1 - $scope.newitem.Size2 > 5 ? 5 : app.Size - $scope.newitem.Size1 - $scope.newitem.Size2
                        $scope.newitem.Size4 = app.Size - $scope.newitem.Size1 - $scope.newitem.Size2 - $scope.newitem.Size3
                        $scope.newitem.Size1 = parseFloat($scope.newitem.Size1.toFixed(2))
                        $scope.newitem.Size2 = parseFloat($scope.newitem.Size2.toFixed(2))
                        $scope.newitem.Size3 = parseFloat($scope.newitem.Size3.toFixed(2))
                        $scope.newitem.Size4 = parseFloat($scope.newitem.Size4.toFixed(2))
                        $scope.newitem.PaymentAmount = pr.TotalCompensation - pr.UsedAmount - $scope.totalprice()>0? $scope.totalprice():(pr.TotalCompensation - pr.UsedAmount)
                        $scope.newitem.DeltaAmount = $scope.totalprice() - $scope.newitem.PaymentAmount
                        $scope.newitem.ContractDate = moment().format("YYYY-MM-DD")
                        $scope.newitem.Deadline = moment().format("YYYY-MM-DD")
                        $scope.newitem.TransitionSize = pr.ApprovedSize - pr.UsedSize - $scope.newitem.Size1 > 0 ? $scope.newitem.Size1 : pr.ApprovedSize - pr.UsedSize
                        if ($scope.newitem.TransitionSize < 0) $scope.newitem.TransitionSize = 0
                      

                    } else {
                       
                         
                    }
                    $scope.InterestFee = function () {
                        var d1 = moment(rr.DeliveryDate)
                        var d2 = moment($scope.newitem.Deadline)
                        $scope.newitem.TotalInterestSize = pr.ApprovedSize - pr.UsedSize
                        $scope.newitem.InterestDays = d2.diff(d1, "days") - 90 > 0 ? d2.diff(d1, "days") - 90 : 0
                        $scope.newitem.InterestFee = $scope.newitem.InterestDays * $scope.newitem.InterestRate / 100 / 365 * $scope.newitem.PaymentAmount
                        return $scope.newitem.InterestFee
                    }
                    $scope.TransitionFee = function () {
                            
                        $scope.newitem.TransitionFee = $scope.newitem.TransitionDays / 30 * 16 * $scope.newitem.TransitionSize
                        return $scope.newitem.TransitionFee
                    }
                })
           
                $scope.add = function () {
                    $scope.newitem.AppartmentOwners.push(angular.copy($scope.temp))
                    $scope.temp = {}
                }
                $scope.del = function (idx) {
                    $scope.newitem.AppartmentOwners.splice(idx, 1)
                }
                   
            })
        })
        $scope.disable = function () {
            return $scope.msForm.$invalid || !($scope.newitem.Size1 + $scope.newitem.Size2 + $scope.newitem.Size3 + $scope.newitem.Size4 < $scope.app.Size + 0.000001
                && $scope.newitem.Size1 + $scope.newitem.Size2 + $scope.newitem.Size3 + $scope.newitem.Size4 > $scope.app.Size - 0.000001)
        }
        $scope.totalprice = function () {
            return $scope.app == null || $scope.newitem == null ? 0 : $scope.app.Price1 * $scope.newitem.Size1 + $scope.app.Price2 * $scope.newitem.Size2 + $scope.app.Price3 * $scope.newitem.Size3 + $scope.app.Price4 * $scope.newitem.Size4;
        }
    }
    $scope.ok = function () {
        if (commit == false) {
            $modalInstance.close($scope.newitem);
            return;
        }
        if (type == 'pr') {
            $scope.newitem.Residents = $filter('filter')($scope.rr.Residents, { selected: true }, true);
            $scope.newitem.Name =""
            $scope.newitem.Residents.forEach(function (r) {
                $scope.newitem.Name += r.Name + " "
            })
        }
        if (type == 'contract') {
            //$scope.newitem.AppartmentOwners = $scope.pr.Residents
        }
      
        if (item.Id == null) {
            RestService.getclient(type).save($scope.newitem, function (data) {
               
                $modalInstance.close(data)
            },
            function (data) {
                alert(angular.toJson(data))
            })
        } else {
            RestService.getclient(type).update({ Id: $scope.newitem.Id }, $scope.newitem, function () {
                $modalInstance.close($scope.newitem)
            },
            function (data) {
                alert(angular.toJson(data))
            })
        }
        
       
    };
    $scope.cancel = function () {
        $modalInstance.dismiss()
    };

}])

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