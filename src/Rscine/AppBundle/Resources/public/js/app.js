'use strict';

/**
 * @ngdoc overview
 * @name rscine
 * @description
 * # rscine
 *
 * Main module of the application.
 */
angular
  .module('rscine', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'restangular'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/about', {
        templateUrl: 'bundles/rscineapp/views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/profile', {
        templateUrl: 'bundles/rscineapp/views/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile',
      })
      .when('/', {
        templateUrl: 'bundles/rscineapp/views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/offers', {
        templateUrl: 'bundles/rscineapp/views/offers.html',
        controller: 'OffersCtrl',
        controllerAs: 'offers',
        resolve: {
          auth: function (basicAuthentication) {
            return basicAuthentication.isLoggedIn();
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function(event, current, previous, rejection) {
      $location.path("/login");
    });
  });
