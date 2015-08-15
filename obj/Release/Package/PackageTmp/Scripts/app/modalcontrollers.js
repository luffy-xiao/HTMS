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
}]).controller('SaveItemModalCtrl', ['$scope', 'RestService', '$modalInstance', 'type', 'item','commit','$filter', function ($scope, RestService, $modalInstance, type, item,commit,$filter) {

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
    if (type == 'contract') {
        var contract = item
        $scope.contract = item
        $scope.app = RestService.getclient('appartment').get({ id: contract.AppartmentId }, function (app) {
            $scope.pr = RestService.getclient('pr').get({ id: contract.PlacementRecordId }, function (pr) {
                var available = pr.Size - pr.PlacedSize
                contract.Size1 = available >= app.Size ? app.Size : available
                contract.Size2 = app.Size - contract.Size1 > 5 ? 5 : app.Size - contract.Size1
                contract.Size3 = app.Size - contract.Size1 - contract.Size2 > 5 ? 5 : app.Size - contract.Size1 - contract.Size2
                contract.Size4 = app.Size - contract.Size1 - contract.Size2 - contract.Size3 > 5 ? 5 : app.Size - contract.Size1 - contract.Size2 - contract.Size3
            })
        })
        $scope.disable = function () {
            return $scope.msForm.$invalid || ($scope.contract.Size1 + $scope.contract.Size2 + $scope.contract.Size3 + $scope.contract.Size4 != $scope.app.Size)
        }
        $scope.totalprice = function () {
            var app = $scope.app
            var contract = $scope.contract
            return app == null || contract == null ? 0 : app.Price1 * contract.Size1 + app.Price2 * contract.Size2 + app.Price3 * contract.Size3 + app.Price4 * contract.Size4
        }
    }

    $scope.newitem = angular.copy(item)

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
            $scope.newitem.Price = $scope.totalprice()
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
