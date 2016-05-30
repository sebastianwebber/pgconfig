angular.module('pgconfig.controllers',
    [
        'ngResource',
        'ngclipboard',
        'ngMaterial',
        'pgconfig.services'
    ])
    .controller('MainHeaderController', MainHeaderController)
    .controller('TuningController',  TuningController)
    .controller('TuningToolbarController', TuningToolbarController);