angular.module('pgconfig.controllers',
    [
        'ngResource',
        'ngclipboard',
        'ngMaterial',
        'pgconfig.services',
        'pgconfig.directives'
    ])
    .controller('MainHeaderController', MainHeaderController)
    .controller('TuningController',  TuningController)
    .controller('TuningToolbarController', TuningToolbarController);