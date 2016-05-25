function MainMenuController($scope, $location, $log) {
    $scope.selectedIndex = 0;
    $scope.$watch('selectedIndex', function (current, old) {
        switch (current) {
            case 0:
                $location.url("/about");
                break;
            case 1:
                $location.url("/tuning");
                break;
        }
    });
};