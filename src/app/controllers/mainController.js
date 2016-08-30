angular.module('pgconfig.controllers',
    [
        'ngResource',
        'ngclipboard',
        'ngMaterial',
        'pgconfig.services',
        'pgconfig.directives',
        'hljs'
    ])
    .controller('MainHeaderController', MainHeaderController)
    .controller('TuningController',  TuningController)
    .controller('ParameterDirectiveController',  ParameterDirectiveController)
    .controller('TuningExportController',  TuningExportController)
    .controller('TuningToolbarController', TuningToolbarController);