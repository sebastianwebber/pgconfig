var pgConfigApp = angular.module('pgConfig', ['ngAnimate', 'angular-loading-bar', 'ngNumeraljs']);

pgConfigApp.config(['$numeraljsConfigProvider', function ($numeraljsConfigProvider) {
    $numeraljsConfigProvider.setFormat('bytes', '0b');
    $numeraljsConfigProvider.setFormat('decimal', '0');
    $numeraljsConfigProvider.setFormat('float', '0.0');
    $numeraljsConfigProvider.setDefaultFormat('0.0');
}]);

pgConfigApp.directive('pgsqlRelated', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/templates/pgsql-related.html'
  };
});

// server-details.html
pgConfigApp.directive('serverDetails', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/templates/server-details.html'
  };
});

// usage.html
pgConfigApp.directive('usage', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/templates/usage.html'
  };
});

// pgbadger-usage.html
pgConfigApp.directive('pgbadgerUsage', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/templates/pgbadger-usage.html'
  };
});

// usage.html
pgConfigApp.directive('forkMe', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/templates/fork-me.html'
  };
});

pgConfigApp.controller('ConfigurationController', function ($scope, $http, $filter, $location) {

  USAGE_FILE = [];

  $http.get('data/enviroments.json').success(function(data) {
    $scope.enviroments = data;
  });

  $scope.isActive = function (viewLocation) {
    var active = (viewLocation === $location.path());
    return active;
  };


  $scope.version = '1.2';

  $http.get('data/pgsql-parameters.json').success(function(data) {
    $scope.pgsql_parameters = data;
  });

  $scope.selectedUsageTab = "WEB";
  $scope.selectUsageTab = function(envName) {
    $scope.selectedUsageTab = envName;
  };

  $scope.isSelectUsageTab = function(tabName) {
    return $scope.selectedUsageTab === tabName;
  };


  $scope.selectedPGBadgerTab = "stderr";
  $scope.selectBadgerTab = function(tabName) {
    $scope.selectedPGBadgerTab = tabName;
  };

  $scope.isSelectedBadgerTab = function(tabName) {
    return $scope.selectedPGBadgerTab === tabName;
  };


  $scope.formatBadgerSpecifics = function (logFormat) {

    var returnData = "";

    if (logFormat === 'stderr') {
      return "log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d '\n";
    } else {
      return "log_line_prefix = 'user=%u,db=%d '\n" +
             "\nsyslog_facility = 'LOCAL0'\n" +
             "syslog_ident = 'postgres'\n";
    };

    return returnData;
  };

  $scope.formatParameters = function (envName) {

    var data = $scope.pgsql_parameters;
    var returnData = "# Using '" + envName + "' profile\n\n";

    if (data != null) {

      for (var parmGroupId = data.length - 1; parmGroupId >= 0; parmGroupId--) {

        var parameterList = data[parmGroupId].parameterList;
        
        for (var parmId = parameterList.length - 1; parmId >= 0; parmId--) {

          var rulesList = parameterList[parmId].rules;

          for (var ruleId = rulesList.length - 1; ruleId >= 0; ruleId--) {
            if (envName === rulesList[ruleId].env_name) {

              var newValue = $filter('process_formula')(rulesList[ruleId].formula, $scope.form.total_ram, parameterList[parmId].max_value, $scope.form.max_connections, 0);
              var newParsedLine = parameterList[parmId].name + ' = ' + $filter('numeraljs')(newValue, parameterList[parmId].format);

              returnData += newParsedLine + '\n';
            };
          };
        };
      };
    };

    return returnData;
  };

});

pgConfigApp.filter('process_formula', function() {
  return function(input, total_ram, max_value, max_connections) {

  	var new_formula=
    input.replace('TOTAL_RAM', to_bytes(total_ram + 'GB'));


    if (max_connections != null) {
      new_formula = new_formula.replace('MAX_CONNECTIONS', max_connections)
    };

  	var resultData = eval(new_formula);
  	
  	if (max_value != null) {
	  	var max_value_bytes = to_bytes(max_value);

	  	if (resultData > max_value_bytes) {
	  		resultData = max_value_bytes;
	  	};
  	};

    return resultData;
  };
});


pgConfigApp.filter('format_field', function() {
  return function(input, format, precision) {


    if (format != null) {
      if (format === "bytes") {
        if (isNaN(parseFloat(input)) || !isFinite(input)) return '-';
        if (typeof precision === 'undefined') precision = 2;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
        number = Math.floor(Math.log(input) / Math.log(1024));
        // console.info("input: " + input + " number: " + number);
        return (input / Math.pow(1024, Math.floor(number))).toFixed(precision) +  units[number];
      };

    };
    return input;
  }
}); 


pgConfigApp.filter('to_bytes', function() {
  return function(input) {
    return to_bytes(input);
  };
});

pgConfigApp.filter('adjust_version', function() {
  return function(input, version) {
    return input.replace('PG_VERSION', version);
  };
});

function to_bytes(input) {
	var returnValue = 0;

  if (input == null) {
    return returnValue;
  };
  
  if (String(input).toUpperCase().indexOf("PB") !=-1) {
    returnValue = input.match(/[0-9]{1,}/i)[0] * 1024 * 1024 * 1024 * 1024 * 1024;
  } else if (String(input).toUpperCase().indexOf("TB") !=-1) {
    returnValue = input.match(/[0-9]{1,}/i)[0] * 1024 * 1024 * 1024 * 1024;
  } else if (String(input).toUpperCase().indexOf("GB") !=-1) {
    returnValue = input.match(/[0-9]{1,}/i)[0] * 1024 * 1024 * 1024;
  } else if (String(input).toUpperCase().indexOf("MB") !=-1) {
    returnValue = input.match(/[0-9]{1,}/i)[0] * 1024 * 1024;
  } else if (String(input).toUpperCase().indexOf("KB") !=-1) {
    returnValue = input.match(/[0-9]{1,}/i)[0] * 1024;
  }

	return returnValue;
}