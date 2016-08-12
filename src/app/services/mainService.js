angular.module('pgconfig.services', [])
    .factory('APITuningGetConfigSingleEnvironmentService', function ($resource, config) {
        var resource = $resource(config.apiURL + '/tuning/get-config', {}, {
            get: {
                method: "get",
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
    .factory('APITuningGetConfigAllEnvironmentService', function ($resource, config) {
        var resource = $resource(config.apiURL + '/tuning/get-config-all-environments', {}, {
            get: {
                method: "get",
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
    .factory('pgbadgerGeneratorService', function ($resource, config) {
        var resource = $resource(config.apiURL + '/generators/pgbadger/get-config', {}, {
            get: {
                method: "get",
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
    .service('tuningToolbarService', TuningToolbarService);

