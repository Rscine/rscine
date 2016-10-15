'use strict';

/**
 * @ngdoc service
 * @name rscine.basicAuthentication
 * @description
 * # basicAuthentication
 * Provider in the rscine.
 */
angular.module('rscine')
    .provider('basicAuthentication', function () {
        var sessionStateCookieName = 'logged';

        function BasicAuthenticator($cookies, $q, oAuthAuthentication) {
            this.authenticate = function (username, password) {
                return oAuthAuthentication.authenticate(username, password).then(function () {
                    $cookies.put(sessionStateCookieName, 'authenticated');

                    return $q.resolve();
                });
            };

            this.invalidateSession = function () {
                $cookies.put(sessionStateCookieName, 'anonymous');
                // @todo remove the token and refresh token as well
                return $q.resolve();
            }

            this.isLoggedIn = function () {
                var userState = $cookies.get(sessionStateCookieName);

                if (userState == 'authenticated') {
                    return $q.resolve();
                } else {
                    return $q.reject();
                }
            }
        }

        // Method for instantiating
        this.$get = function ($cookies, $q, oAuthAuthentication) {
            return new BasicAuthenticator($cookies, $q, oAuthAuthentication);
        };
    });
