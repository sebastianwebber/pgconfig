function TuningExportController($scope, $stateParams, APITuningGetConfigSingleEnvironmentService, $window, $mdToast) {

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
    if ($stateParams.environment_name != null)
        $scope.environment = $stateParams.environment_name;
    if ($stateParams.os_type != null)
        $scope.os_type = $stateParams.os_type;
    if ($stateParams.arch != null)
        $scope.arch = $stateParams.arch;
    if ($stateParams.drive_type != null)
        $scope.drive_type = $stateParams.drive_type;
    if ($stateParams.cpus != null)
        $scope.cpus = Number($stateParams.cpus);

    // prior to 9.4 ALTER SYSTEM are not supported_formats
    if ($scope.pg_version <= 9.3) {
        $scope.supported_formats.shift();
    }

    $scope.backToTuning = function () {
        $window.history.back();
    };

    $scope.showSimpleToast = function (message) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(message)
                .position('bottom right')
                .hideDelay(1500)
        );
    };

    $scope.call_api = function () {

        if (typeof $scope.export_format !== 'undefined') {

            $scope.code_output = 'exporting...';

            if ($scope.generate_pgbadger == true) {
                APITuningGetConfigSingleEnvironmentService.get_simple({
                    pg_version: $scope.pg_version,
                    total_ram: $scope.total_memory + "GB",
                    max_connections: $scope.max_connections,
                    environment_name: $scope.environment,
                    format: $scope.export_format,
                    os_type: $scope.os_type,
                    arch: $scope.arch,
                    cpus: $scope.cpus,
                    drive_type: $scope.drive_type,
                    include_pgbadger: $scope.generate_pgbadger,
                    log_format: $scope.log_format
                }, function (apiResult) {
                    $scope.code_output = apiResult.collection;
                });
            } else {
                APITuningGetConfigSingleEnvironmentService.get_simple({
                    pg_version: $scope.pg_version,
                    total_ram: $scope.total_memory + "GB",
                    max_connections: $scope.max_connections,
                    environment_name: $scope.environment,
                    os_type: $scope.os_type,
                    arch: $scope.arch,
                    drive_type: $scope.drive_type,
                    format: $scope.export_format
                }, function (apiResult) {
                    $scope.code_output = apiResult.collection;
                });
            }
        }
    };
}