(function (angular, undefined) {
    "use strict";
    angular.module('PGConfigUI', ['ngMaterial', 'angular-loading-bar', 'ngResource', 'ui.router'])
        .config(function ($stateProvider, $urlRouterProvider) {
            // $urlRouterProvider.otherwise("/about");
            $stateProvider
                .state('about_url', {
                    url: "/about",
                    templateUrl: "app/partials/about.html"
                })
                .state('tuning_url', {
                    url: "/tuning?total_ram&max_connections&enviroment_name&pg_version&share_link",
                    templateUrl: "app/partials/tuning.html"
                })
                .state("otherwise", {
                    url: "*path",
                    templateUrl: "app/partials/about.html",
                });
        })
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
        
        // cache stuff
        .run(['$templateCache', function ($templateCache) {
            $templateCache.removeAll();
        }])

        .controller('TuningController', function ($scope, $location, $log, $http, $resource, $mdSidenav, $stateParams) {
            $scope.total_memory = 2;
            $scope.max_connections = 100;
            $scope.pg_version = "9.5";
            $scope.enviroment = "WEB";

            if ($stateParams.total_ram != null)
                $scope.total_memory = Number($stateParams.total_ram);
            if ($stateParams.max_connections != null)
                $scope.max_connections = Number($stateParams.max_connections);
            if ($stateParams.pg_version != null)
                $scope.pg_version = $stateParams.pg_version;
            if ($stateParams.enviroment_name != null)
                $scope.enviroment = $stateParams.enviroment_name;


            $scope.supported_versions = [
                "9.5",
                "9.4",
                "9.3",
                "9.2",
                "9.1",
            ];

            $scope.show_toolbar = false;

            $scope.envFilters = [
                {
                    value: "WEB",
                    description: 'For general web applications',
                }, {
                    value: "OLTP",
                    description: 'For ERP or long transaction applications',
                }, {
                    value: "DW",
                    description: 'For DataWare house and BI Applications',
                }, {
                    value: "Mixed",
                    description: 'For DB and APP on the same server',
                }, {
                    value: "Desktop",
                    description: 'For developer local machine',
                },
            ];

            var TuningAPI = $resource("http://api.pgconfig.org/v1/tuning/get-config", {});

            $scope.close = function () {
                $mdSidenav('left').close()
                    .then(function () {
                        // $log.debug("close LEFT is done");
                    });
            };

            $scope.call_api = function () {
                TuningAPI.get({
                    pg_version: $scope.pg_version,
                    total_ram: $scope.total_memory + "GB",
                    max_connections: $scope.max_connections,
                    env_name: $scope.enviroment,
                    format: "json",
                    show_doc: true
                }, function (apiResult) {
                    $scope.api_data = apiResult.data;
                    $scope.close();
                    $scope.show_toolbar = true;
                });
            };

            // http://localhost:5000/#/tuning?enviroment_name=OLTP&total_ram=256&max_connections=200&pg_version=9.4&share_link=true
            if ($stateParams.share_link != null && $stateParams.share_link == "true")
                $scope.call_api();
        });

})(angular);