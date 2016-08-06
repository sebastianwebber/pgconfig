function DialogExportController($scope, $mdDialog, $location, $resource, $stateParams, tuningApiService, pgbadgerGeneratorService) {
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

    // $scope.export_format = "alter_system"
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

    $scope.log_format_options = [
        {
            value: "csvlog",
            description: "Comma-separated values"
        },
        {
            value: "syslog",
            description: "Syslog daemon"
        },
        {
            value: "stderr",
            description: "Standard error output"
        }
    ];

    // defaults
    $scope.generate_pgbadger = true;
    $scope.log_format = "stderr";

    if ($stateParams.total_ram != null)
        $scope.total_memory = Number($stateParams.total_ram);
    if ($stateParams.max_connections != null)
        $scope.max_connections = Number($stateParams.max_connections);
    if ($stateParams.pg_version != null)
        $scope.pg_version = $stateParams.pg_version;
    if ($stateParams.enviroment_name != null)
        $scope.enviroment = $stateParams.enviroment_name;

    $scope.call_api = function () {

        if (typeof $scope.export_format !== 'undefined') {

            $scope.code_output = 'exporting...';

            tuningApiService.get_simple({
                pg_version: $scope.pg_version,
                total_ram: $scope.total_memory + "GB",
                max_connections: $scope.max_connections,
                env_name: $scope.enviroment,
                format: $scope.export_format,
            }, function (apiResult) {
                $scope.code_output = apiResult.collection;
            });

            if ($scope.generate_pgbadger == true) {
                pgbadgerGeneratorService.get_simple({
                    log_format: $scope.log_format,
                    show_about: "false",
                    format: $scope.export_format,
                }, function (apiResult) {
                    $scope.code_output = $scope.code_output + apiResult.collection;
                });
            }
        }
    };
};