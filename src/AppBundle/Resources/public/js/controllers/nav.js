'use strict';

/**
 * @ngdoc function
 * @name rscine.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rscine
 */
angular.module('rscine')
    .controller('NavCtrl', function ($scope, $mdSidenav, basicAuthentication, $location) {
        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('right');

        function buildToggler(componentId) {
            return function() {
                $mdSidenav(componentId).toggle();
            }
        }

        $scope.openMenu = function($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        };

        $scope.logout = function () {
            basicAuthentication.invalidateSession().then(function () {
                $location.path('/');
            })
        }
    });
