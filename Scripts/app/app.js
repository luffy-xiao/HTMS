'use strict';

/* App Module */


var appmodule = angular.module('ms.site', ['ngCookies','ngRoute', 'ms.site.controllers',
  'ms.site.services', 'ms.site.directives', 'ms.site.filters', 'ui.bootstrap', 
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
                when('/resident/export', {
                    templateUrl: '/pages/resident/resident_export.html',
                    controller: 'ResidentExportCtrl'
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
                }).when('/pricetemplate', {
                    templateUrl: '/pages/metadata/pricetemplate.html',
                    controller: 'PriceTemplateCtrl'
                }).when('/contract/create', {
                    templateUrl: '/pages/contract/contract_detail.html',
                    controller: 'ContractCtrl'
                }).when('/contract/export', {
                    templateUrl: '/pages/contract/contract_export.html',
                    controller: 'ContractExportCtrl'
                }).when('/placementrecords', {
                    templateUrl: '/pages/contract/placement_list.html',
                    controller: 'PlacementRecordCtrl'
                }).when('/placementrecords/export', {
                    templateUrl: '/pages/contract/placement_export.html',
                    controller: 'PlacementExportCtrl'
                })
                  .when('/placementrecords/:prid/contracts/:cid/printconfirmation', {
                      templateUrl: '/pages/print/contractconfirm.html',
                      controller: 'PrintBCtrl'
                }).
                  when('/placementrecords/:prid/printrecords', {
                      templateUrl: '/pages/print/contractrecord.html',
                      controller: 'PrintBCtrl'
                  })
                  .when('/placementrecords/:prid/contracts/:cid/printrecord', {
                      templateUrl: '/pages/print/contractrecord.html',
                      controller: 'PrintBCtrl'
                  }).
                when('/', {
                    templateUrl: '/pages/legacy/legacy.html',
                }).
                otherwise({
                    redirectTo: '/'
                })
          }])


appmodule.run(function ($http, $cookies) {
    if ($cookies.token != null) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.token
    }
});