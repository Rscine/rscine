'use strict';

/**
 * @ngdoc service
 * @name rscine.loader
 * @description
 * # loader
 * Provider in the rscine.
 */
angular.module('rscine')
    .provider('loader', function () {
        // Private constructor
        function Loader() {
            this.loading = false;

            this.isLoading = function () {
                console.log(this.loading);
                return this.loading;
            };

            this.startLoading = function () {
                this.loading = true;
                console.log(this.loading);
            };

            this.finishLoading = function () {
                this.loading = false;
            };
        }

        // Method for instantiating
        this.$get = function () {
            return new Loader();
        };
    });
