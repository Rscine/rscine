'use strict';

/**
 * @ngdoc function
 * @name rscine.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the rscine
 */
angular.module('rscine')
  .controller('AboutCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

'use strict';

/**
 * @ngdoc function
 * @name rscine.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the rscine
 */
angular.module('rscine')
  .controller('HomeCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

'use strict';

/**
 * @ngdoc function
 * @name rscine.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the rscine
 */
angular.module('rscine')
    .controller('LoginCtrl', function ($scope, basicAuthentication, $location, $mdToast) {
        $scope.user = {};

        $scope.authenticate = function () {
            basicAuthentication.authenticate($scope.user.login, $scope.user.password).then(function () {
                $location.path('/');
            }, function () {
                $mdToast.show({
                    hideDelay   : 3000,
                    position    : 'top right',
                    controller  : 'LoginCtrl',
                    templateUrl : 'bundles/app/views/login/error.html'
                });
            });
        }

        $scope.closeToast = function () {
            $mdToast.hide()
        }
    });

'use strict';

/**
 * @ngdoc function
 * @name rscine.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rscine
 */
angular.module('rscine')
    .controller('MainCtrl', function ($scope) {

    });

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

'use strict';

/**
 * @ngdoc function
 * @name rscine.decorator:Restangular
 * @description
 * # Restangular
 * Decorator of the rscine
 */
angular.module('rscine')
    .config(function ($provide) {
        $provide.decorator('Restangular', function ($delegate, oAuthAuthentication, $http) {
            $delegate.getBaseUrl = function () {
                return 'http://api.rscine.dev';
            }

            $delegate.setBaseUrl($delegate.getBaseUrl() + '/api/v1');

            $delegate.addFullRequestInterceptor(function (element, operation, what, url, headers, params, httpConfig) {
                if (operation == 'get' || operation =='getList') {
                    params['access_token'] = oAuthAuthentication.getToken();

                    return {
                        element: element,
                        headers: headers,
                        params: params,
                        httpConfig: httpConfig
                    }
                }
            })

            $delegate.setErrorInterceptor(function(response, deferred, responseHandler) {
                if(response.status === 401) {
                    oAuthAuthentication.getAccessTokenByRefreshToken(oAuthAuthentication.getRefreshToken()).then(function() {
                        // Repeat the request and then call the handlers the usual way.
                        $http(response.config).then(responseHandler, deferred.reject);
                        // Be aware that no request interceptors are called this way.
                    });

                    return false; // error handled
                }

                return true; // error not handled
            });

            return $delegate;
        });
    });

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
        var clientId = '3_37dlg40m7yioswkkwo80s08s0cc8gggksoogssc4wgow08cwc8';
        var clientSecret = 'c1wk8pz84e0w80w0osg4gcss44wwowscs08kcokggosow4kwo';

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
                return $http({
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

                    return $q.resolve();
                }, function error(response) {
                    return $q.reject();
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
