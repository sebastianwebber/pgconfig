angular.module('pgconfig.factories',[])
    .factory('tuningAPIFactory', function ($resource, config) {
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
    });
