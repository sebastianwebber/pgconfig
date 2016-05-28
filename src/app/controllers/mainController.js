angular.module('pgconfig.controllers',
    [
        'ngResource',
        'ngclipboard',
        'ngMaterial',
    ])
    .controller('MainHeaderController', MainHeaderController)
    .controller('TuningController', TuningController)
    .controller('TuningToolbarController', TuningToolbarController);