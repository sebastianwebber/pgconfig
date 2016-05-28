(function (angular, undefined) {
    "use strict";
    angular.module('pgconfig', [
        'angular-loading-bar',
        'pgconfig.controllers',
        'pgconfig.factories',
        'pgconfig.routes',
        'pgconfig.config',
        'pgconfig.templates',
    ])
    .run(function($templateCache, $compile, $rootScope){
        var templatesHTML = $templateCache.get('pgconfig.templates');
        $compile(templatesHTML)($rootScope); 
    });

})(angular);