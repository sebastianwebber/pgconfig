function TuningController($scope, $stateParams, $state, APITuningGetConfigAllEnvironmentService, tuningToolbarService) {
    tuningToolbarService.toolbar.hide();
    $scope.total_memory = 2;
    $scope.max_connections = 100;
    $scope.pg_version = "10";
    $scope.environment = "WEB";
    $scope.os_type = "Linux";
    $scope.arch = "x86-64";
    $scope.drive_type = 'HDD';
    //$scope.cpus = 1;

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

    $scope.supported_versions = [
        "10",
        "9.6",
        "9.5",
        "9.4",
        "9.3",
        "9.2",
    ];

    $scope.supported_drivers = [
        { value: "HDD", description: "HDD storage" },
        { value: "SSD", description: "SSD storage" },
        { value: "SAN", description: "Network (SAN) storage" }
    ];

    // $scope.show_toolbar = false;

    $scope.envFilters = [
        {
            value: "WEB",
            description: 'General web applications',
        }, {
            value: "OLTP",
            description: 'ERP or long transaction applications',
        }, {
            value: "DW",
            description: 'DataWare house and BI Applications',
        }, {
            value: "Mixed",
            description: 'DB and APP on the same server',
        }, {
            value: "Desktop",
            description: 'Developer local machine',
        },
    ];

    $scope.osFilters = [
        {
            value: "Linux",
            description: 'GNU/Linux Based',
        },
        {
            value: "Windows",
            description: 'Windows Based',
        },
        {
            value: "Unix",
            description: 'Unix Based',
        }
    ];

    $scope.archFilters = [
        {
            value: "x86-64",
            description: '64 Bits (x86-64)',
        },
        {
            value: "i686",
            description: '32 Bits (i686)',
        }
    ];

    $scope.close = function () {
        tuningToolbarService.menu.hide('left');
    };


    $scope.$on('menu:opened', function (event, data) {
        $scope.api_data = null;
        $scope.first_api_data = null;
    });

    $scope.make_url = function () {
        $state.go('.', {
            environment_name: $scope.environment,
            total_ram: $scope.total_memory,
            max_connections: $scope.max_connections,
            pg_version: $scope.pg_version,
            os_type: $scope.os_type,
            arch: $scope.arch,
            cpus: $scope.cpus,
            drive_type: $scope.drive_type,
            share_link: true,
        });
    };

    $scope.call_api = function () {
        APITuningGetConfigAllEnvironmentService.get({
            pg_version: $scope.pg_version,
            total_ram: $scope.total_memory + "GB",
            max_connections: $scope.max_connections,
            environment_name: $scope.environment,
            os_type: $scope.os_type,
            arch: $scope.arch,
            cpus: $scope.cpus,
            drive_type: $scope.drive_type,
            format: "json",
            show_doc: true,
        }, function (apiResult) {
            $scope.api_data = apiResult.data;
            $scope.first_api_data = apiResult.data[0].configuration;
            $scope.close();
            tuningToolbarService.toolbar.show();
        });
    };

    if ($stateParams.share_link != null && $stateParams.share_link == "true")
        $scope.call_api();

    $scope.$on("$destroy", function () {
        tuningToolbarService.toolbar.hide();
    });

    $scope.isSelectedEnvironment = function (env) {
        return (env == $scope.environment) ? 'selectedEnvironment' : '';
    };
};