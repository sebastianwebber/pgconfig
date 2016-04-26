var pgConfigApp = angular.module('pgConfig', ['ngAnimate', 'angular-loading-bar', 'ngNumeraljs']);

pgConfigApp.config(['$numeraljsConfigProvider', function ($numeraljsConfigProvider) {
    $numeraljsConfigProvider.setFormat('bytes', '0b');
    $numeraljsConfigProvider.setFormat('decimal', '0');
    $numeraljsConfigProvider.setFormat('float', '0.0');
    $numeraljsConfigProvider.setDefaultFormat('0.0');
}]);

pgConfigApp.directive('autoFocus', function() {
    return {
        restrict: 'AC',
        link: function(_scope, _element) {
            _element[0].focus();
        }
    };
});

pgConfigApp.directive('highlight', function($interpolate, $window){
    return {
    restrict: 'EA',
    scope: true,
    compile: function (tElem, tAttrs) {
      var interpolateFn = $interpolate(tElem.html(), true);
      tElem.html(''); // stop automatic intepolation

      return function(scope, elem, attrs){
        scope.$watch(interpolateFn, function (value) {
          var format = attrs.highlight;

          if (format == "")
            format = 'bash';

          elem.html(hljs.highlight(format,value).value);
        });
      }
    }
  };
});

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


  $scope.version = '1.50';

  $scope.showAtVersion = function(currentVersion, minimumVersion, maximunVersion) {
    // console.info("currentVersion: " + currentVersion) + "--" + "minimumVersion: " + minimumVersion;
    if (currentVersion >= minimumVersion && currentVersion <= maximunVersion) {
      return true;
    } else {
      return false;
    }
  };

  $scope.filterVersion = function(currentVersion) {
    return function(item) {
      // console.debug(item);

      // console.info('---------------');
      // console.info('nome: ' + item.name);
      minimumVersion = parseFloat(item.min_version);
      maximunVersion = parseFloat(item.max_version);
          // console.debug('minimumVersion: ' + minimumVersion);
          // console.debug('maximunVersion: ' +maximunVersion);
          // console.debug('currentVersion: ' + currentVersion);

      // console.info('filter: ' + currentVersion + ' - min: ' + item.min_version + ' - max: '+ item.max_version );

      // logica insana:
      // 1. se não tem minimo declarado, mostra
      // 2. se tem minimo, e tem maximo, filtra o intervalo
      // 3. se tem minimo, mas não maximo, compara se o minimo é >= que a versão atual
      if (minimumVersion > 0) {
        if (maximunVersion > 0) {
          if (currentVersion >= minimumVersion && currentVersion <= maximunVersion) {
            return item;
          }
        } else {
          if (currentVersion >= minimumVersion) {
            return item;
          }
        }
      } else {
        return item;
      }
    }
  };

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


  $scope.formatBadgerSpecifics = function (logFormat, format) {

    var returnData = "";

    if (typeof format === 'undefined') format = 'PLAIN';

    if (logFormat === 'stderr') {
      if (format === 'PLAIN')
        return "log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '\n";
      else if (format === 'SQL')
        return "ALTER SYSTEM SET log_line_prefix TO '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h ';\n";
    } else {
      if (format === 'PLAIN')
        return "log_line_prefix = 'user=%u,db=%d,app=%aclient=%h '\n" +
               "\nsyslog_facility = 'LOCAL0'\n" +
               "syslog_ident = 'postgres'\n";
      else if (format === 'SQL')
        return "ALTER SYSTEM SET log_line_prefix TO 'user=%u,db=%d,app=%aclient=%h ';\n" +
               "\nALTER SYSTEM SET syslog_facility TO 'LOCAL0';\n" +
               "ALTER SYSTEM SET syslog_ident TO 'postgres';\n";
    };

    return returnData;
  };

  $scope.formatParameters = function (envName, format, currentVersion) {

    // console.info('---------------');
    // console.debug(envName, format, currentVersion);

    if (typeof format === 'undefined') format = 'PLAIN';

    var data = $scope.pgsql_parameters;
    var returnData = '';

    if (format == 'PLAIN')
      returnData = '# '
    else if (format == 'SQL')
      returnData = "-- ";

    returnData += "Using '" + envName + "' profile\n\n";

    if (data != null) {

      for (var parmGroupId = data.length - 1; parmGroupId >= 0; parmGroupId--) {

        var parameterList = data[parmGroupId].parameterList;
        
        for (var parmId = parameterList.length - 1; parmId >= 0; parmId--) {



          // testa se parametro pertence a versao...
          minimumVersion = parseFloat(parameterList[parmId].min_version);
          maximunVersion = parseFloat(parameterList[parmId].max_version);

          var showParameter = false;

          if (minimumVersion > 0) {
            if (maximunVersion > 0) {
              if (currentVersion >= minimumVersion && currentVersion <= maximunVersion) {
                showParameter = true;
              }
            } else {
              if (currentVersion >= minimumVersion) {
                showParameter = true;
              }
            }
          } else {
            showParameter = true;
          }

          if (showParameter == true) {

                      var rulesList = parameterList[parmId].rules;
          for (var ruleId = rulesList.length - 1; ruleId >= 0; ruleId--) {
            if (envName === rulesList[ruleId].env_name) {


              var newValue = $filter('process_formula')(rulesList[ruleId].formula, $scope.form.total_ram, parameterList[parmId].max_value, $scope.form.max_connections, 0);

              var newValuePretty = $filter('numeraljs')(newValue, parameterList[parmId].format);

              var newParsedLine = '';
              if (format == 'PLAIN')
                newParsedLine = parameterList[parmId].name + ' = ' +  newValuePretty;
              else if (format == 'SQL')
                newParsedLine = 'ALTER SYSTEM SET ' + parameterList[parmId].name + ' TO \'' +  newValuePretty + '\';';


              returnData += newParsedLine + '\n';
              // console.debug(minimumVersion, maximunVersion)
            };
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