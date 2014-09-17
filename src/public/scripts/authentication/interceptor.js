(function () {
    'use strict';

    var repertoireApp = angular.module('repertoire');

    repertoireApp.factory('authInterceptor', function ($rootScope, $q, $window, $location) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                }
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    $location.path('/login');
                    if ($window.sessionStorage.token) {
                        $window.sessionStorage.token = undefined;
                    }
                }
                return response || $q.when(response);
            }
        };
    });

    repertoireApp.config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });

}());
