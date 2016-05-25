angular.module('pgconfig.controllers',
    [
        'ngResource',
        'ngclipboard',
        'ngMaterial',
    ])
    .controller('MainMenuController', MainMenuController)
    .controller('MainHeaderController', MainHeaderController)
    .controller('TuningController', TuningController)
    .controller('TuningToolbarController', TuningToolbarController);