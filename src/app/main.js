(function (angular, undefined) {
    "use strict";
    angular.module('pgconfig', [
        'angular-loading-bar',
        'pgconfig.controllers',
        'pgconfig.services',
        'pgconfig.routes',
        'pgconfig.config',
        'pgconfig.templates',
    ]);
})(angular);