function TuningToolbarService($rootScope) {
    var toolbar_visible = false;

    var service = {
        status: toolbar_status,
        toolbar: {
            show: show_toolbar,
            hide: hide_toolbar
        },
        menu : {
            show: show_menu,
            hide: hide_menu            
        }
    };
    return service;

    function toolbar_status() {
        return toolbar_visible;
    };

    function show_toolbar() {
        toolbar_visible = true;
        $rootScope.$broadcast('toolbar:updated', toolbar_visible);
    };

    function hide_toolbar() {
        toolbar_visible = false;
        $rootScope.$broadcast('toolbar:updated', toolbar_visible);
    };

    function show_menu(menu_name) {
        $rootScope.$broadcast('menu:opened', null);
    }

    function hide_menu(menu_name) {
        // $rootScope.$broadcast('menu:hidden', null);
    }
};