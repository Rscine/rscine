'use strict';

/**
 * @ngdoc function
 * @name rscine.controller:OffersCtrl
 * @description
 * # OffersCtrl
 * Controller of the rscine
 */
angular.module('rscine')
    .controller('OffersCtrl', function ($scope, Restangular) {
        var hydratedOffers = [];

        Restangular.all('offers').getList().then(function (offers) {
            angular.forEach(offers, function (offer, key) {
                Restangular.one('individuals', offer._links.creator.id).get().then(function (individual) {
                    offer.creator = individual;
                    hydratedOffers.push(offer);
                });
            })

            $scope.offers = hydratedOffers;
        })
    });
