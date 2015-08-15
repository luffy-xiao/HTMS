'use strict';

/* App Module */


var appmodule = angular.module('ms.site', ['ngRoute', 'ms.site.controllers',
  'ms.site.services', 'ms.site.directives', 'ms.site.filters', 'ui.bootstrap'
 // 'ms.site.filters'
])
        .config(['$routeProvider',
          function ($routeProvider) {
              $routeProvider.
                when('/resident/create', {
                    templateUrl: '/pages/resident/resident_detail.html',
                    controller: 'ResidentCreateCtrl'
                }).
                when('/resident/search', {
                    templateUrl: '/pages/resident/resident_search.html',
                    controller: 'ResidentSearchCtrl'
                }).
                when('/resident/issue', {
                    templateUrl: '/pages/resident/resident_issue.html',
                    controller: 'ResidentIssueCtrl'
                }).
                when('/resident/detail/:id/readonly=:readonly', {
                    templateUrl: '/pages/resident/resident_detail.html',
                    controller: 'ResidentDetailCtrl'
                }).
                when('/users', {
                    templateUrl: '/pages/user/user_list.html',
                    controller: 'UserListCtrl'
                }).
                when('/relocationbases', {
                    templateUrl: '/pages/relocationbase/relocationbase_list.html',
                    controller: 'RBListCtrl'
                }).
                when('/villages', {
                    templateUrl: '/pages/metadata/village_list.html',
                    controller: 'VillageCtrl'
                }).
                when('/groups', {
                    templateUrl: '/pages/metadata/group_list.html',
                    controller: 'GroupCtrl'
                }).
                when('/communities', {
                     templateUrl: '/pages/appartment/community_list.html',
                     controller: 'CommunityCtrl'
                }).when('/appartments', {
                    templateUrl: '/pages/appartment/appartment_list.html',
                    controller: 'AppartmentCtrl'
                }).when('/bulkcreate', {
                    templateUrl: '/pages/metadata/bulkcreate.html',
                    controller: 'BulkCreateCtrl'
                })./*when('/appartment/detail/:id/readonly=:readonly', {
                    templateUrl: '/pages/appartment/appartment_detail.html',
                    controller: 'AppDetailCtrl'
                })*/when('/pricetemplate', {
                    templateUrl: '/pages/metadata/pricetemplate.html',
                    controller: 'PriceTemplateCtrl'
                }).when('/contract/create', {
                    templateUrl: '/pages/contract/contract_detail.html',
                    controller: 'ContractCtrl'
                }).when('/placementrecords', {
                    templateUrl: '/pages/contract/placement_list.html',
                    controller: 'PlacementRecordCtrl'
                }).
                when('/', {
                    templateUrl: '/pages/legacy/legacy.html',
                }).
                otherwise({
                    redirectTo: '/'
                })
          }])

appmodule.run(function ($http) {
    $http.defaults.headers.common.Authorization = 'Bearer ' + sessionStorage.getItem("token")
});