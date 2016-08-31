function ParameterDirectiveController($scope) {
    // $scope.app_version = config.appVersion;
    // $scope.app_desc = config.appFullName;

    $scope.show_details = false;
    $scope.show_doc = false;

    $scope.toggle = function(){
        $scope.show_details = !$scope.show_details;
    };

    $scope.toggle_doc = function(){
        $scope.show_doc = !$scope.show_doc;
    };
};