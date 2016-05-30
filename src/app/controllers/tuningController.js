function TuningController($scope, $mdSidenav, $stateParams, $state, tuningApiService, tuningToolbarService) {
    tuningToolbarService.toolbar.hide();
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

    // $scope.show_toolbar = false;

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

    $scope.close = function () {
        tuningToolbarService.menu.hide('left');
    };


    $scope.$on('menu:opened', function (event, data) {
        $scope.api_data = null;
    });

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
        tuningApiService.get({
            pg_version: $scope.pg_version,
            total_ram: $scope.total_memory + "GB",
            max_connections: $scope.max_connections,
            env_name: $scope.enviroment,
            format: "json",
            show_doc: true
        }, function (apiResult) {
            $scope.api_data = apiResult.data;
            $scope.close();
            tuningToolbarService.toolbar.show();
        });
    };

    if ($stateParams.share_link != null && $stateParams.share_link == "true")
        $scope.call_api();

    $scope.$on("$destroy", function () {
        tuningToolbarService.toolbar.hide();
    });
};