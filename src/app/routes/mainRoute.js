angular.module('pgconfig.routes', ['ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tuning_url', {
                url: "/tuning?total_ram&max_connections&environment_name&pg_version&os_type&arch&cpus&drive_type&share_link",
                templateUrl: "/app/templates/tuning/main.html"
            })
            .state('tuning-export_url', {
                url: "/tuning/export?total_ram&max_connections&environment_name&pg_version&os_type&arch&cpus&drive_type&share_link",
                templateUrl: "/app/templates/tuning/export/main.html"
            })
            .state('about_url', {
                url: "/about",
                templateUrl: "/app/templates/about.html"
            });

        $urlRouterProvider.otherwise('/tuning');
    });
