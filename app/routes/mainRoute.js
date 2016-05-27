angular.module('pgconfig.routes', ['ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tuning_url', {
                url: "/tuning?total_ram&max_connections&enviroment_name&pg_version&share_link",
                templateUrl: "/partials/tuning/main.html"
            })
            .state('about_url', {
                url: "/about",
                templateUrl: "/partials/about.html"
            });
            
        $urlRouterProvider.otherwise('/tuning');
    });
