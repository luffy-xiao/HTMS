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
    InitDataPicker($scope)
    if (type == 'appartment') {
        $scope.ftypes = RestService.getclient('ftype').query();
        $scope.apptypes = RestService.getclient('apptype').query();
        $scope.dtypes = RestService.getclient('dtype').query();
    }
    if (type == 'resident') {
        $scope.rts = RestService.getclient('rt').query();     
    }
    if (type == 'pr') {
        if (item.Id != null) {//modify item, show the residents in the record
            $scope.rr = {}
            $scope.rr.Residents = item.Residents
            $scope.rr.Residents.forEach(function (r) {
                r.selected=true
            })
        } else {// new record, show the residents can be selected
            $scope.rr = RestService.getclient('rr').get({ id: item.RelocationRecordId }, function (rr) {
                rr.Residents = $filter('filter')(rr.Residents, function (value) {
                    return value.PlacementRecordId == null
                })
            })
        }
        
    }
   
    $scope.newitem = angular.copy(item);
    // Contract modal.
    if (type == 'contract') {
        $scope.app = RestService.getclient('appartment').get({ id: $scope.newitem.AppartmentId }, function (app) {
            $scope.pr = RestService.getclient('pr').get({ id: $scope.newitem.PlacementRecordId }, function (pr) {
                RestService.getclient('contract').query({ $filter: "PlacementRecordId eq " + pr.Id }, function (contracts) {
                    var total = 0
                    var size = 0;
                    contracts.forEach(function (c) {
                        //total += c.Size1 * c.Appartment.Price1 + c.Size2 * c.Appartment.Price2 + c.Size3 * c.Appartment.Price3 + c.Size4 * c.Appartment.Price4;
                        size += c.Size1 + c.Size2 + c.Size3 + c.Size4;
                    })
                    
                    // Handle floating digits.
                    var available = parseFloat((pr.Size - size).toFixed(2));
                    if (item.Id == null) {
                        $scope.newitem.AppartmentOwners = [];
                        
                        if (available < 0) available = 0
                        $scope.newitem.Size1 = available >= app.Size ? app.Size : available
                        $scope.newitem.Size2 = app.Size - $scope.newitem.Size1 > 5 ? 5 : parseFloat((app.Size - $scope.newitem.Size1).toFixed(2));
                        $scope.newitem.Size3 = app.Size - $scope.newitem.Size1 - $scope.newitem.Size2 > 5 ? 5 : parseFloat((app.Size - $scope.newitem.Size1 - $scope.newitem.Size2).toFixed(2));
                        $scope.newitem.Size4 = parseFloat((app.Size - $scope.newitem.Size1 - $scope.newitem.Size2 - $scope.newitem.Size3).toFixed(2));
                        
                    } else {
                        $scope.newitem = RestService.getclient('contract').get({ id: item.Id })
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
            return $scope.msForm.$invalid || ($scope.newitem.Size1 + $scope.newitem.Size2 + $scope.newitem.Size3 + $scope.newitem.Size4 != $scope.app.Size)
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