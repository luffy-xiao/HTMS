'use strict';

/* Services */

var appServices = angular.module('ms.site.services', ['ngResource', 'ngCookies']);


appServices.factory('Constants', ['$resource','$filter',
  function ($resource,$filter) {

      var dic = new Array();
    
      function getlist(type) {
          if (dic[type] == undefined) {
              var resouce = $resource('/data/' + type + '.json', {}, {
              })
              dic[type] = resouce.query();
          }
          return dic[type];
      }

      return {
          list: function (type) {
             return getlist(type)
          },
          filter: function (id, type) {
              if (dic[type] == undefined) {
                  var resouce = $resource('/data/' + type + '.json', {}, {
                  })
                  resouce.query(function (list) {
                      return $filter(resultlist, "{id:" + id + "}")

                  });
              }
       
          }
      }
   
  }]).factory('UserService', ['$http', '$rootScope', '$resource', '$window', '$cookies', function ($http, $rootScope, $resource, $window, $cookies) {

      var user = null;
      if ($cookies.user != null) {
          try {
              user = angular.fromJson($cookies.user);
          }catch(e){
              $cookies.user=null
          }
          
      }
      var resouce = $resource('/api/Users/:userId', { userId:'@id'}, {
      })
     
      var rst = {
          getcurrentuser: function () {
              return user;
          },
          login: function (username, password,success,fail) {
              var loginData = "grant_type=password&username=" + username + "&password=" + password;

              $http.post("/token",loginData).success(function (data) {
                  // Cache the access token in session storage.
                  $cookies.token= data.access_token;
                  $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.token
                  $http.get("/api/Account/info").success(function (data) {
                      user = data
                      $cookies.user= angular.toJson(user);
                      //$rootScope.user = user;
                      //$rootScope.$broadcast('user_changed', user);
                      $window.location.reload()
                  }).error(function () {
                      $cookies.user = null;
                  })
                  success()
              }).error(function () {
                  fail()
              })
          },
          logout: function () {
              user = null;
              $cookies.user = null;
              $rootScope.user = user;
              $rootScope.$broadcast('user_changed', user);
              $window.location.reload()
          },
          list: function () {
              return  resouce.query()
          },
          create: function (newuser){
              return resouce.save(newuser)
          },
          remove: function (userId,done) {
              return resouce.remove({ userId: userId }, function (data) {
                 done()
              })
          }
      };
       
      return rst;
  }]).factory('RestService', ['$http', '$resource', function ($http, $resource) {
      var clients = []
      clients['rb'] = $resource('/api/RelocationBases/:id', { id: '@id' }, { 'update': { method: 'PUT' } })
      clients['resident'] = $resource('/api/Residents/:id', { id: '@id' }, { 'update': { method: 'PUT' }, 'query': { isArray: false } })
      clients['rr'] = $resource('/api/RelocationRecords/:id', { id: '@id' }, { 'update': { method: 'PUT' } })
      clients['rt'] = $resource('/api/RelationshipTypes/:id', { id: '@id' }, { 'update': { method: 'PUT' } })
      clients['village'] = $resource('/api/Villages/:id', { id: '@id' }, { 'update': { method: 'PUT' } })
      clients['group'] = $resource('/api/Groups/:id', { id: '@id' }, { 'update': { method: 'PUT' } })
      clients['community'] = $resource('/api/Communities/:id', { id: '@id' }, { 'update': { method: 'PUT' } })
      clients['building'] = $resource('/api/Buildings/:id', { id: '@id' }, { 'update': { method: 'PUT' } })
      clients['appartment'] = $resource('/api/Appartments/:id', { id: '@id' }, { 'update': { method: 'PUT' }, 'query': { isArray: false } })
      clients['apptype'] = $resource('/api/AppartmentTypes/:id', { id: '@id' }, { 'update': { method: 'PUT' } })
      clients['ftype'] = $resource('/api/FacingTypes/:id', { id: '@id' }, { 'update': { method: 'PUT' } })
      clients['dtype'] = $resource('/api/DecorationTypes/:id', { id: '@id' }, { 'update': { method: 'PUT' } })
      clients['user'] = $resource('/api/Users/:id', { id: '@id' }, { 'update': { method: 'PUT' } })
      clients['model'] = $resource('/api/Models/:id', { id: '@id' }, { 'update': { method: 'PUT' } })
      clients['header'] = $resource('/api/Headers/:id', { id: '@id' }, { 'update': { method: 'PUT' } })
      clients['pt'] = $resource('/api/PriceTemplates/:id', { id: '@id' }, { 'update': { method: 'PUT' } })
      clients['pr'] = $resource('/api/PlacementRecords/:id', { id: '@id' }, { 'update': { method: 'PUT' } })
      clients['contract'] = $resource('/api/Contracts/:id', { id: '@id' }, { 'update': { method: 'PUT' } })
      return {
          getclient: function(resoucename){
              return clients[resoucename]
          }

      }
      
  }])