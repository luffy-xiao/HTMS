'use strict';

/* Directives */
var appDirectives = angular.module('ms.site.directives',[]);


var IDCARD_REGEXP = /(^\d{17}(\d|X)$)/;
var INTEGER_REGEXP = /^\-?\d+$/;
var MONEY_REGEXP = /^\d+(\.\d{1,2})?$/;

function validateidenttiycard(id) {
    var arr = id.split(''), sum = 0, vc = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    for (var i = 0; i < 17; i++) sum += vc[i] * parseInt(arr[i]);
    return ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'][sum % 11];
}

appDirectives.directive('idcard', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.integercheck = function (modelValue, viewValue) {        
                if (IDCARD_REGEXP.test(viewValue)) {
                    // it is valid
                    return true;
                }
                // it is invalid
                return false;
            };
            ctrl.$validators.idcardcheck = function (modelValue, viewValue) {
              
                if (viewValue == null)
                    return true
                if (validateidenttiycard(viewValue) != viewValue[17])
                    return false
                // it is invalid
               
                return true;
            };
        }
    };
});
appDirectives.directive('integer', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.integercheck = function (modelValue, viewValue) {        
                if (viewValue==null || viewValue==""||INTEGER_REGEXP.test(viewValue)) {
                    // it is valid
                    return true;
                }
                // it is invalid
                return false;
            };

        }
    };
});
appDirectives.directive('currency', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.currencycheck = function (modelValue, viewValue) {
                if (viewValue==null || viewValue==""|| MONEY_REGEXP.test(viewValue)) {
                    // it is valid
                    
                    return true;
                }
                // it is invalid
                return false;
            };

        }
    };
})
appDirectives.directive('compare', function () {
    return {
        require: 'ngModel',
        scope: {
            otherModelValue: "=compare"
        },
        link: function (scope, elm, attrs, ctrl) {
          

            ctrl.$validators.compareTo = function (modelValue) {
                
                    return scope.otherModelValue == null || modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ctrl.$validate();
                });

        }
    };
})