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
        Restangular.one('users', 'me').get().then(function (user) {
            $scope.user = user;
            Restangular.one('companies', user._links.company.id).get().then(function (company) {
                $scope.user.company = company;
            })
        })
    });
