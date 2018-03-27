angular.module('pgconfig.config', [])
    .constant('config', {
        appName: 'PGConfigUI',
        appFullName: 'PostgreSQL Configuration Tool',
        appVersion: '2.0 beta',
        //apiURL: 'https://api.pgconfig.org/v1',
        apiURL: 'http://localhost:5000/v1'
    })
    .config(function($mdThemingProvider) {
        $mdThemingProvider
            .theme('default')
            .primaryPalette('blue')
            .accentPalette('orange');
    })
    .run(['$rootScope', function($rootScope) {
        $rootScope.angular = angular;
    }]);