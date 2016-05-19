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
                redirectTo: "/about"
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
                        $location.url("/about");
                        break;
                    case 1:
                        $location.url("/tuning");
                        break;
                }
            });
        })

        .controller('TuningController', function ($scope, $location, $log) {

            $scope.total_memory = 2;
            $scope.max_connections = 100;
            $scope.pg_version = "9.5";

            $scope.supported_versions = [
                "9.5",
                "9.4",
                "9.3",
                "9.2",
                "9.1",
                "9.0",
            ];
        });

})(angular);