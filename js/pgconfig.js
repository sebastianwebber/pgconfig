
function roundFix(number, precision)
{
    var multi = Math.pow(10, precision);
    return Math.round( (number * multi).toFixed(precision + 1) ) / multi;
}

function format_value (value, compl, tooltip) {
	column = $('<td>', { 'title' : tooltip });

	column.append(
			value + ' ' + compl
		);

	return column;
}

$(document).ready(function(){

  $("#b_generate").click(function(){
  	MB = 1024;
  	env_list = [ 'WEB', 'OLTP', 'DW', 'Mixed', 'Desktop' ];


    total_memory=$('#total_memory').val();
    max_connections=$('#max_connections').val();
    pg_version=$('#pg_version').val();

    buffers_table=$('<table />', {
    	'class': 'table table-striped table-bordered'
    });

    buffers_table.append(
    		$('<thead>').append(
    				$('<tr>').append(
    						$('<th>').append('Parameter')
    					).append(
    						$('<th>').append('WEB')
    					).append(
    						$('<th>').append('OLTP')
    					).append(
    						$('<th>').append('DW')
    					).append(
    						$('<th>').append('Mixed')
    					).append(
    						$('<th>').append('Desktop')
    					)
    			)
    	);


    tbody=$('<tbody>');

    // shared_buffers
    row = $('<tr>').append(
    				$('<td>').append(
    						$('<a>', {
    							'href' : 'http://www.postgresql.org/docs/' + pg_version + '/static/runtime-config-resource.html#GUC-SHARED-BUFFERS',
    							target : '_BLANK'
    						}).append('shared_buffers')
    					)
    			); 
    env_list.forEach(function(entry) {
    	new_value = total_memory * MB / 4;
    	formula_desc = '25% (1/4) of total RAM up to a maximum of 8GB'

    	if (entry == 'Desktop') {
    		new_value = total_memory * MB / 16;
    		formula_desc = '6.25% (1/16) of total RAM up to a maximum of 8GB'
    	};

	    if (new_value > 8096) {
	    	new_value = 8096;
	    };

	    row.append(
	    	format_value(
	    		roundFix(new_value, 2), 
	    		'MB', 
	    		formula_desc
	    		)
	    	);
	});

    tbody.append(row);

    // effective_cache_size
    row = $('<tr>').append(
    				$('<td>').append(
    						$('<a>', {
    							'href' : 'http://www.postgresql.org/docs/' + pg_version + '/static/runtime-config-query.html#GUC-EFFECTIVE-CACHE-SIZE',
    							target : '_BLANK'
    						}).append('effective_cache_size')
    					)
    			); 
    env_list.forEach(function(entry) {
    	new_value = total_memory * MB / 4 * 3;
    	formula_desc = '3/4 of total RAM';

    	if (entry == 'Desktop') {
    		new_value = total_memory * MB / 4;
    		formula_desc = '25% (1/4) of total RAM';
    	};

    	row.append(
	    	format_value(
	    		roundFix(new_value, 2), 
	    		'MB', 
	    		formula_desc
	    		)
	    	);
	});

    tbody.append(row);
    
    // work_mem
    row = $('<tr>').append(
    				$('<td>').append(
    						$('<a>', {
    							'href' : 'http://www.postgresql.org/docs/' + pg_version + '/static/runtime-config-resource.html#GUC-WORK-MEM',
    							target : '_BLANK'
    						}).append('work_mem')
    					)
    			); 
    env_list.forEach(function(entry) {
    	new_value = total_memory * MB / max_connections;

    	formula_desc = 'total RAM divided by max_connections';

    	switch (entry) {
    		case 'DW':
    		case 'Mixed':
    			new_value = new_value / 2;
    			formula_desc = '50% (1/2) of total RAM divided by max_connections';
    			break;
    		case 'Desktop':
    			new_value = new_value / 6;
    			formula_desc = '1/6 of total RAM divided by max_connections';
    			break;
    	}

    	row.append(
	    	format_value(
	    		roundFix(new_value, 2), 
	    		'MB', 
	    		formula_desc
	    		)
	    	);
	});

    tbody.append(row);

    
    // maintenance_work_mem
    row = $('<tr>').append(
    				$('<td>').append(
    						$('<a>', {
    							'href' : 'http://www.postgresql.org/docs/' + pg_version + '/static/runtime-config-resource.html#GUC-MAINTENANCE-WORK-MEM',
    							target : '_BLANK'
    						}).append('maintenance_work_mem')
    					)
    			); 
    env_list.forEach(function(entry) {
    	new_value = total_memory * MB / 16;
    	formula_desc = '6.25% (1/16) of total RAM up to a maximum of 2GB';

    	switch (entry) {
    		case 'DW':
    			new_value = total_memory * MB / 8;
    			formula_desc = '12.25% (1/8) of total RAM up to a maximum of 2GB';
    			break;
    	}

    	if (new_value > 2048) {
    		new_value = 2048;
    	};

	    row.append(
	    	format_value(
	    		roundFix(new_value, 2), 
	    		'MB', 
	    		formula_desc
	    		)
	    	);
	});

    tbody.append(row);

	buffers_table.append(tbody);

	buffers_panel=$('<div>', { class : 'panel panel-default' });

	buffers_panel.append($('<div>', { class: 'panel-heading' }).append('Memory Configuration'));
	buffers_panel.append(buffers_table);


    $('#generated_data').empty();
    $('#generated_data').append(
    		$('<div>', { class: "row"}).append(
    				$('<div>', { class : "col-md-12"}).append(buffers_panel)
    			)
    	);


	// columns and rows 
	$('td').mouseover(function () {
	    $(this).siblings().css('background-color', '#f5f5f5');
	    var ind = $(this).index();
	    $('td:nth-child(' + (ind + 1) + ')').css('background-color', '#f5f5f5');
	});
	$('td').mouseleave(function () {
	    $(this).siblings().css('background-color', '');
	    var ind = $(this).index();
	    $('td:nth-child(' + (ind + 1) + ')').css('background-color', '');
	});

	// initialize tooltips
	$("[rel='tooltip'], .tooltip").tooltip();

  });
});