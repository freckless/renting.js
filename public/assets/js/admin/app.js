"use strict";angular.module("adminApp",["ngResource","ngTouch","ngRoute","ngLocale","pascalprecht.translate"]),angular.module("adminApp").config(["$locationProvider","$routeProvider","$translateProvider",function($locationProvider,$routeProvider,$translateProvider){$translateProvider.useStaticFilesLoader({prefix:"/assets/js/admin/i18n/",suffix:".json"}),$translateProvider.preferredLanguage("es"),$locationProvider.hashPrefix("!"),$routeProvider.otherwise({redirectTo:"/"})}]),angular.module("adminApp").run(["$rootScope","$location","$translate","$locale",function($rootScope,$location,$translate,$locale){$rootScope.$location=$location,$rootScope.$translate=$translate,$rootScope.$locale=$locale}]),angular.module("adminApp").factory("UserService",function($resource){return $resource("/admin/users/:id",{id:"@_id"},{update:{method:"PUT"}})}),angular.module("adminApp").directive("backButton",function(){return{restrict:"A",link:function(scope,element){element.addClass("back-button"),element.bind("click",function(){window.history.back()})}}}),angular.module("adminApp").config(["$routeProvider",function($routeProvider){$routeProvider.when("/",{templateUrl:"assets/js/admin/views/dashboard/index.html",controller:"DashboardCtrl"})}]),angular.module("adminApp").controller("DashboardCtrl",["$rootScope",function($rootScope){$rootScope.current_section="dashboard"}]),angular.module("adminApp").config(["$routeProvider",function($routeProvider){$routeProvider.when("/users",{templateUrl:"assets/js/admin/views/users/index.html",controller:"UsersIndexCtrl",resolve:{Users:function(UserService){return UserService.query().$promise}}}).when("/users/create",{templateUrl:"assets/js/admin/views/users/form.html",controller:"UsersCreateCtrl"}).when("/users/edit/:id",{templateUrl:"assets/js/admin/views/users/form.html",controller:"UsersEditCtrl",resolve:{User:function(UserService,$route){return UserService.get({id:$route.current.params.id}).$promise}}})}]),angular.module("adminApp").controller("UsersIndexCtrl",function($scope,$rootScope,Users){$rootScope.current_section="users",$scope.users=Users}),angular.module("adminApp").controller("UsersCreateCtrl",function($scope,UserService){$scope.groups={Admin:2,Owner:3,Customer:4},$scope.user=new UserService,$scope.action="creating"}),angular.module("adminApp").controller("UsersEditCtrl",function($scope,$rootScope,User){$scope.groups={Admin:2,Owner:3,Customer:4},$rootScope.current_section="users",$scope.action="editing",$scope.user=User});