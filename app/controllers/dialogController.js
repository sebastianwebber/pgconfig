function DialogController($scope, $mdDialog, $location, $resource, $stateParams, tuningAPIFactory) {
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
        tuningAPIFactory.get_simple({
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