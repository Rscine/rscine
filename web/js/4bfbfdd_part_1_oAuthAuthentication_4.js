'use strict';

/**
 * @ngdoc service
 * @name rscine.oauthAuthentication
 * @description
 * # oauthAuthentication
 * Provider in the rscine.
 */
angular.module('rscine')
    .provider('oAuthAuthentication', function () {
        var tokenCookieName = 'token';
        var refreshTokenCookieName = 'refreshToken';

        var accessTokenUrl = 'http://api.rscine.dev/oauth/v2/token';
        var clientId = '1_5mouievuzeccc8s8kc4gkgsc4owcwok8woog4o4ko8gcgow84w';
        var clientSecret = '1ves0oek8uxwskgows04ckoo8wswkoowoc40o0g8os80sckogs';

        function OAuthAuthenticator($cookies, $http, $q) {
            var self = this;

            /**
             * Returns the access token from the session
             * @return {string}
             */
            this.getTokenFromSession = function () {
                return $cookies.get(tokenCookieName);
            };

            /**
             * Ask for an access token to the server
             * @return {string|null}
             */
            this.getAccessToken = function () {
                if (this.getRefreshToken()) {
                    return this.getAccessTokenByRefreshToken(this.getRefreshToken());
                } else {
                    return null;
                }
            }

            /**
             * Ask for an access token to the server by providing a refresh token
             * @param  {string} refreshToken
             * @return {string|null}
             */
            this.getAccessTokenByRefreshToken = function (refreshToken) {
                $http({
                    method: 'post',
                    url: accessTokenUrl,
                    data: {
                        'grant_type': 'refresh_token',
                        'client_id': clientId,
                        'client_secret': clientSecret,
                        'refresh_token': refreshToken
                    }
                }).then(function success(response) {
                    self.setToken(response.data.acess_token);
                    self.setRefreshToken(response.data.refresh_token);

                    return self.getToken();
                }, function error(response) {
                    return null;
                });
            }

            /**
             * Ask for an access token to the server by providing user credentials
             * @param  {string} username
             * @param  {string} password
             * @return {string|null}
             */
            this.authenticate = function (username, password) {
                return $http({
                    method: 'post',
                    url: accessTokenUrl,
                    data: {
                        'grant_type': 'password',
                        'client_id': clientId,
                        'client_secret': clientSecret,
                        'username': username,
                        'password': password
                    }
                }).then(function success(response) {
                    self.setToken(response.data.access_token);
                    self.setRefreshToken(response.data.refresh_token);

                    return $q.resolve();
                }, function error(response) {
                    return $q.reject();
                });
            }

            /**
             * Gets a token either from the session or by asking it to the server
             * @return {string|null}
             */
            this.getToken = function () {
                return this.getTokenFromSession() || this.getAccessToken();
            };

            /**
             * Sets the access token to the session
             */
            this.setToken = function (token) {
                $cookies.put(tokenCookieName, token);
            };

            /**
             * Sets the refresh token to the session
             */
            this.setRefreshToken = function (refreshToken) {
                $cookies.put(refreshTokenCookieName, refreshToken);
            }

            /**
             * Gets a the refresh token from the session
             * @return {string|null}
             */
            this.getRefreshToken = function () {
                return $cookies.get(refreshTokenCookieName);
            }
        }

        // Method for instantiating
        this.$get = function ($cookies, $http, $q) {
            return new OAuthAuthenticator($cookies, $http, $q);
        };
    });
