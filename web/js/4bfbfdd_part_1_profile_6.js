'use strict';

/**
 * @ngdoc function
 * @name rscine.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the rscine
 */
angular.module('rscine')
    .controller('ProfileCtrl', function ($scope, Restangular) {
        Restangular.one('users', 1).get().then(function (user) {
            $scope.user = user;
        })
    });
