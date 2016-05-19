(function (angular, undefined) {
    "use strict";
    angular.module('PGConfigUI', ['ngMaterial', 'ngRoute', 'angular-loading-bar'])
        .config(["$routeProvider", function ($routeProvider) {

            $routeProvider.when("/tuning", {
                templateUrl: "app/partials/tuning.html"
            });
            $routeProvider.when("/about", {
                templateUrl: "app/partials/about.html"
            });
            $routeProvider.otherwise({
                redirectTo: "/tuning"
            });
        }])
        .config(function ($mdThemingProvider) {
            $mdThemingProvider
                .theme('default')
                .primaryPalette('blue-grey')
                .accentPalette('grey');
        })

        .controller('MenuController', function ($scope, $location, $log) {
            $scope.selectedIndex = 0;

            $scope.$watch('selectedIndex', function (current, old) {
                switch (current) {
                    case 0:
                        $location.url("/tuning");
                        break;
                    case 1:
                        $location.url("/about");
                        break;
                }
            });
        });

})(angular);