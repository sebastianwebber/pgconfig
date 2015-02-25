var pgConfigApp = angular.module('pgConfig', []);

pgConfigApp.controller('ConfigurationController', function ($scope, $http) {
  $http.get('data/enviroments.json').success(function(data) {
    $scope.enviroments = data;
  });

  $http.get('data/pgsql-parameters.json').success(function(data) {
    $scope.pgsql_parameters = data;
  });
});

pgConfigApp.filter('process_formula', function() {
  return function(input, total_ram, max_value) {

  	var new_formula=
  		input.replace('TOTAL_RAM', to_bytes(total_ram + 'GB'));


  	var max_value_bytes = to_bytes(max_value);

  	var resultData = eval(new_formula);

  	if (resultData > max_value_bytes) {
  		resultData = max_value_bytes;
  	};

  	// console.info(max_value);

  	// TODO:
  	// echo fazer o eval da formula e retornar o valor. ;D

    // input = input || '';
    // var out = "";
    // for (var i = 0; i < input.length; i++) {
    //   out = input.charAt(i) + out;
    // }
    // // conditional based on optional argument
    // if (uppercase) {
    //   out = out.toUpperCase();
    // }
    return resultData;
  };
});

pgConfigApp.filter('bytes', function() {
	return function(bytes, precision) {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
		if (typeof precision === 'undefined') precision = 1;
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
		number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
	}
}); 


pgConfigApp.filter('to_bytes', function() {
  return function(input) {
    return to_bytes(input);
  };
});

function to_bytes(input) {
	var returnValue = 0;
	
	// console.info(input.search());

	if (String(input).toUpperCase().indexOf("GB") !=-1) {
		// console.info(input.match(/[0-9]{1,}/i)[0]);
		// console.info(input);
		returnValue = input.match(/[0-9]{1,}/i)[0] * 1024 * 1024 * 1024;
	}


	return returnValue;
}