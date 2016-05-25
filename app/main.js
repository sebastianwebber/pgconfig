(function (angular, undefined) {
    "use strict";
    angular.module('PGConfigUI', ['ngMaterial', 'angular-loading-bar', 'ngResource', 'ui.router', 'ngclipboard'])
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

        .factory('TuningAPI', function ($resource) {
            var resource = $resource('http://api.pgconfig.org/v1/tuning/get-config', {}, {
                get: {
                    method: "get",
                    // isArray: false,
                    // headers: {
                    //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    // } // ignored
                },
                get_simple: {
                    method: "get",
                    isArray: false,
                    headers: {
                        'Content-Type': 'text/plain; charset=UTF-8'
                    },
                    transformResponse: function (data) {
                        return { collection: data }
                    }
                }
            });
            return resource;
        })

        // cache stuff
        .run(['$templateCache', function ($templateCache) {
            $templateCache.removeAll();
        }])

        .controller('TuningController', function ($scope, $location, $log, $http, $resource, $mdSidenav, $stateParams, $state, TuningAPI) {
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

            // var TuningAPI = $resource("http://api.pgconfig.org/v1/tuning/get-config", {});

            $scope.close = function () {
                $mdSidenav('left').close()
                    .then(function () {
                        // $log.debug("close LEFT is done");
                    });
            };
            $scope.open_menu = function () {
                $mdSidenav('left').open()
                    .then(function () {
                        // $log.debug("close LEFT is done");
                        $scope.api_data = null;
                        $scope.show_toolbar = false;
                    });
            };

            $scope.make_url = function () {
                $state.go('.', {
                    enviroment_name: $scope.enviroment,
                    total_ram: $scope.total_memory,
                    max_connections: $scope.max_connections,
                    pg_version: $scope.pg_version,
                    share_link: true
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

            if ($stateParams.share_link != null && $stateParams.share_link == "true")
                $scope.call_api();
        })


        .controller('TuningToolbarController', function ($scope, $location, $log, $mdDialog, $mdMedia) {
            $scope.status = '  ';
            $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
            $scope.share_url = function (ev) {
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application
                // to prevent interaction outside of dialog
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(false)
                        .title('Share URL')
                        .textContent('You can specify some description text in here.')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('Got it!')
                        .targetEvent(ev)
                );
            };

            $scope.showExportWindow = function (ev) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'app/partials/export.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: useFullScreen
                });
                $scope.$watch(function () {
                    return $mdMedia('xs') || $mdMedia('sm');
                }, function (wantsFullScreen) {
                    $scope.customFullscreen = (wantsFullScreen === true);
                });
            };

            $scope.showShareURL = function (ev) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'app/partials/share-url.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: useFullScreen
                });
                $scope.$watch(function () {
                    return $mdMedia('xs') || $mdMedia('sm');
                }, function (wantsFullScreen) {
                    $scope.customFullscreen = (wantsFullScreen === true);
                });
            };
        })
        ;

    function DialogController($scope, $mdDialog, $location, $resource, $stateParams, TuningAPI) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };

        // TODO: Review generation of this fucking URL
        $scope.share_url = $location.absUrl();

        $scope.export_format = "alter_system"
        $scope.supported_formats = [
            {
                value: "alter_system",
                description: 'ALTER SYSTEM command',
            },
            {
                value: "conf",
                description: 'UNIX-like config file',
            },
        ];

        if ($stateParams.total_ram != null)
            $scope.total_memory = Number($stateParams.total_ram);
        if ($stateParams.max_connections != null)
            $scope.max_connections = Number($stateParams.max_connections);
        if ($stateParams.pg_version != null)
            $scope.pg_version = $stateParams.pg_version;
        if ($stateParams.enviroment_name != null)
            $scope.enviroment = $stateParams.enviroment_name;

        $scope.call_api = function () {
            TuningAPI.get_simple({
                pg_version: $scope.pg_version,
                total_ram: $scope.total_memory + "GB",
                max_connections: $scope.max_connections,
                env_name: $scope.enviroment,
                format: $scope.export_format,
                // show_doc: false
            }, function (apiResult) {
                $scope.code_output = apiResult.collection;
                // $log.debug($scope.code_output);
                // $scope.close();
                // $scope.show_toolbar = true;
            });
        };
    };

})(angular);