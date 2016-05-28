angular.module('pgconfig.routes', ['ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tuning_url', {
                url: "/tuning?total_ram&max_connections&enviroment_name&pg_version&share_link",
                templateUrl: "/app/partials/tuning/main.html"
            })
            .state('about_url', {
                url: "/about",
                templateUrl: "/app/partials/about.html"
            });
            
        $urlRouterProvider.otherwise('/tuning');
    });
