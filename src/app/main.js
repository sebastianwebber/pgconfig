"use strict";

(function (angular, undefined) {
    angular.module('pgconfig', [
        'angular-loading-bar',
        'pgconfig.controllers',
        'pgconfig.services',
        'pgconfig.routes',
        'pgconfig.config',
        'pgconfig.templates',
        'pgconfig.directives'
    ]);
})(angular);