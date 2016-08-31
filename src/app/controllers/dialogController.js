function DialogController($scope, $mdDialog, $location) {
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
}; 