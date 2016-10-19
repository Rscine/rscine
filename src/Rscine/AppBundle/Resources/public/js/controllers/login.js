'use strict';

/**
 * @ngdoc function
 * @name rscine.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the rscine
 */
angular.module('rscine')
    .controller('LoginCtrl', function ($scope, basicAuthentication, $location, $mdToast, $http) {
        $scope.user = {};


        $scope.authenticate = function () {
            var formData = {username: $scope.user.login, password: $scope.user.password};

            $http({
                method: 'post',
                url: '/login_check',
                data: formData
            }).then(function success(response) {
                $location.path('/');
            }, function error(response) {
                $mdToast.show({
                    hideDelay   : 3000,
                    position    : 'top right',
                    controller  : 'LoginCtrl',
                    templateUrl : 'bundles/app/views/login/error.html'
                });
            });

            // basicAuthentication.authenticate($scope.user.login, $scope.user.password).then(function () {
            //     $location.path('/');
            // }, function () {
            //     $mdToast.show({
            //         hideDelay   : 3000,
            //         position    : 'top right',
            //         controller  : 'LoginCtrl',
            //         templateUrl : 'bundles/app/views/login/error.html'
            //     });
            // });
        }

        $scope.closeToast = function () {
            $mdToast.hide()
        }
    });
