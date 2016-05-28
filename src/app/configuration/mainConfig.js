angular.module('pgconfig.config', [])
    .constant('config', {
        appName: 'PGConfigUI',
        appFullName: 'PostgreSQL Configuration Tool',
        appVersion: '2.0 beta',
        apiURL: 'http://api.pgconfig.org/v1'
    })
    .config(function ($mdThemingProvider) {
        $mdThemingProvider
            .theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('grey');
    })
    .run(['$templateCache', function ($templateCache) {
        $templateCache.removeAll();
    }]);
