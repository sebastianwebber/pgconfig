
function roundFix(number, precision)
{
    var multi = Math.pow(10, precision);
    return Math.round( (number * multi).toFixed(precision + 1) ) / multi;
}

USAGE_FILE = new Array();

function gen_tr_start_pgsql(param_name, doc_url, pg_version){
    return $('<tr>').append(
                    $('<td>').append(
                            $('<a>', {
                                'href' : 'http://www.postgresql.org/docs/' + pg_version + '/static/' + doc_url,
                                target : '_BLANK'
                            }).append(param_name)
                        )
                ); 
}

function gen_tr_start_simple(param_name, doc_url){
    return $('<tr>').append(
                    $('<td>').append(
                            $('<a>', {
                                'href' : doc_url,
                                target : '_BLANK'
                            }).append(param_name)
                        )
                ); 
}

function compute_checkpoint_related_configuration () {
    new_table=$('<table />', {
        'class': 'table table-striped table-bordered'
    });

    new_table.append(gen_table_header());

    tbody=$('<tbody>');

    // checkpoint_segments
    row = gen_tr_start_pgsql('checkpoint_segments', 'runtime-config-wal.html#GUC-CHECKPOINT-SEGMENTS', pg_version);

    env_list.forEach(function(entry) {

        switch (entry) {
            case 'WEB':
            case 'Mixed':
                new_value = 32;
                break;
            case 'OLTP':
                new_value = 64;
                break;
            case 'DW':
                new_value = 128;
                break;
            case 'Desktop':
                new_value = 3;
                break;
        }

        row.append(
            format_value(
                    roundFix(new_value, 2)
                )
            );

        USAGE_FILE[entry].push('checkpoint_segments = ' + roundFix(new_value, 2));
    });

    tbody.append(row);

    // checkpoint_completion_target
    row = gen_tr_start_pgsql('checkpoint_completion_target', 'runtime-config-wal.html#GUC-CHECKPOINT-COMPLETION-TARGET', pg_version);

    env_list.forEach(function(entry) {

        switch (entry) {
            case 'WEB':
                new_value = 0.7;
                break;
            case 'OLTP':
            case 'DW':
            case 'Mixed':
                new_value = 0.9;
                break;
            case 'Desktop':
                new_value = 0.5;
                break;
        }

        row.append(
            format_value(
                    roundFix(new_value, 2)
                )
            );

        // alert(entry + " " + 'checkpoint_completion_target = ' + roundFix(new_value, 2));
        USAGE_FILE[entry].push('checkpoint_completion_target = ' + roundFix(new_value, 2));
    });

    tbody.append(row);

    // wal_buffers
    row = gen_tr_start_pgsql('wal_buffers', 'runtime-config-wal.html#GUC-WAL-BUFFERS', pg_version);

    env_list.forEach(function(entry) {

        shared_buffers = total_memory * MB / 4;

        if (entry == 'Desktop') {
            shared_buffers = total_memory * MB / 16;
        };

        if (shared_buffers > 8096) {
            shared_buffers = 8096;
        };

        new_value = shared_buffers * 0.03;

        if (new_value >= 14) {
            new_value = 16;
        };

        formula_desc = '3% of total shared_buffers up to a maximum of 16MB';

        row.append(
            format_value(
                    roundFix(new_value, 2),
                    'MB',
                    formula_desc
                )
            );

        USAGE_FILE[entry].push('wal_buffers = ' + roundFix(new_value, 0) + 'MB');
    });

    tbody.append(row);

    new_table.append(tbody);

    new_panel=$('<div>', { class : 'panel panel-default' });

    new_panel.append($('<div>', { class: 'panel-heading' }).append('Checkpoint related configuration'));
    new_panel.append(new_table);


    return new_panel;
}

function compute_sysctl_related_configuration () {
    new_table=$('<table />', {
        'class': 'table table-striped table-bordered'
    });

    new_table.append(gen_table_header());

    tbody=$('<tbody>');

    // checkpoint_segments
    row = gen_tr_start_simple('kernel.shmmax', 'https://access.redhat.com/site/documentation/en-US/Red_Hat_Enterprise_Linux/5/html/Tuning_and_Optimizing_Red_Hat_Enterprise_Linux_for_Oracle_9i_and_10g_Databases/chap-Oracle_9i_and_10g_Tuning_Guide-Setting_Shared_Memory.html#sect-Oracle_9i_and_10g_Tuning_Guide-Setting_Shared_Memory-Setting_SHMMAX_Parameter_');

    env_list.forEach(function(entry) {

        switch (entry) {
            case 'WEB':
            case 'Mixed':
                new_value = 32;
                break;
            case 'OLTP':
                new_value = 64;
                break;
            case 'DW':
                new_value = 128;
                break;
            case 'Desktop':
                new_value = 3;
                break;
        }

        row.append(
            format_value(
                    roundFix(new_value, 2)
                )
            );
    });

    tbody.append(row);

    new_table.append(tbody);

    new_panel=$('<div>', { class : 'panel panel-default' });

    new_panel.append($('<div>', { class: 'panel-heading' }).append('sysctl related configuration'));
    new_panel.append(new_table);


    return new_panel;
}


MB = 1024;
env_list = [ 'WEB', 'OLTP', 'DW', 'Mixed', 'Desktop' ];


function format_value (value) {
    return format_value(value, '', '');
}
function format_value (value, compl, tooltip) {
	column = $('<td>', { 'title' : tooltip });

	column.append(
			value + ' ' + (!compl ? '' : compl)
		);

	return column;
}

function gen_table_header() {
    return $('<thead>').append(
                    $('<tr>').append(
                            $('<th>', { class: 'col-sm-7'}).append('Parameter')
                        ).append(
                            $('<th>', { class: 'col-sm-1'}).append('WEB')
                        ).append(
                            $('<th>', { class: 'col-sm-1'}).append('OLTP')
                        ).append(
                            $('<th>', { class: 'col-sm-1'}).append('DW')
                        ).append(
                            $('<th>', { class: 'col-sm-1'}).append('Mixed')
                        ).append(
                            $('<th>', { class: 'col-sm-1'}).append('Desktop')
                        )
                );
}

VERSION='0.45 beta';


function generate_usage_box(env_name) {

    return_text = "## Generated by PGConfig " + VERSION + "\n";
    return_text += "# Using '" + env_name + "' profile\n\n";

    USAGE_FILE[env_name].forEach(function(entry) {
        return_text += entry + "\n";
        // alert(entry);
    });
    
    return_text += "\n## Connection stuff\n";
    return_text += "max_connections = " + max_connections + "\n";
    return_text += "listen_address = '*'\n";

    return return_text;  
}


function generate_usage_stuff () {

// <ul class="nav nav-pills">
//   <li role="presentation" class="active"><a href="#">Home</a></li>
//   <li role="presentation"><a href="#">Profile</a></li>
//   <li role="presentation"><a href="#">Messages</a></li>
// </ul>


    usage_container = $('<div>', { role: "tabpanel" });
    file_list = $('<ul>', { class: "nav nav-tabs",  role: "tablist" });

    env_list.forEach(function(entry) {

        new_id="usage_" + entry;

        new_link = $('<li>', { role: "presentation"});
        new_link.append($('<a>', { href: "#" + new_id, "arial-controls": new_id, role: "tab", "data-toggle": "tab" }).append(entry));

        if (entry == "WEB") {
            new_link.addClass('active');
        };

        file_list.append(
                new_link
            );
    });

    usage_container.append(file_list);

    content_list = $('<div>', { class: "tab-content", style: "padding-top: 5px;" });

    env_list.forEach(function(entry) {

        new_div=
                $('<div>', { role: "tabpanel", class: "tab-pane fade", id: "usage_" + entry })
                    .append(
                            $('<pre>').append(generate_usage_box(entry))
                        );

        if (entry == "WEB") {
            new_div.addClass('in active');
        };

        content_list.append(new_div);
    });

    usage_container.append(content_list);

  //   <div class="tab-content">
  //   <div role="tabpanel" class="tab-pane active" id="home">...</div>
  //   <div role="tabpanel" class="tab-pane" id="profile">...</div>
  //   <div role="tabpanel" class="tab-pane" id="messages">...</div>
  //   <div role="tabpanel" class="tab-pane" id="settings">...</div>
  // </div>


    return $('<div>', { class: "row"})
        .append(
                $('<div>', { class : "col-md-12"})
                    .append(
                        $('<div>', { class : "page-header" })
                            .append (
                                        $('<h3>').append('Usage')
                                    )
                        )
                            .append(
                                    $('<p>').append('Add this at the bottom of your <code>postgresql.conf</code> file:')
                                )
                            .append(
                                    $('<pre>').append("include = 'tuning.conf'")
                                )
                            .append(
                                    $('<p>').append('Select your profile and create the file <code>tuning.conf</code> inside your <code>PGDATA</code> directory and add this content:')
                                )
                            .append(usage_container)
                            // .append(
                            //         $('<pre>').append( generate_usage_box())
                            //     )

            )
    ;

    // return $('<div>', { class: "row"})
    //     .append(
    //                 $('<div>', { class : "col-md-12"})
    //                     .append(
    //                             $('<div>', { class : "page-header" }).append (
    //                                     $('<h3>').append('Usage')
    //                                 )
    //                             .append(
    //                                     $('p').append('Add this to your postgresql.conf file:')
    //                                 )
    //                         )
    //                     // .append(buffers_panel)
    //             );
}


max_connections = 0;

$(document).ready(function(){

    env_list.forEach(function(entry) {
        USAGE_FILE[entry] = new Array();
    });

  $('.pgconfig_version').empty();
  $('.pgconfig_version').append(VERSION);

  $("#total_memory").focus();

  $("#b_generate").click(function(){
  	MB = 1024;
  	env_list = [ 'WEB', 'OLTP', 'DW', 'Mixed', 'Desktop' ];


    total_memory=$('#total_memory').val();
    max_connections=$('#max_connections').val();
    pg_version=$('#pg_version').val();

    buffers_table=$('<table />', {
    	'class': 'table table-striped table-bordered'
    });

    buffers_table.append(gen_table_header());


    tbody=$('<tbody>');

    // shared_buffers
    row = gen_tr_start_pgsql('shared_buffers', 'runtime-config-resource.html#GUC-SHARED-BUFFERS', pg_version);

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

        USAGE_FILE[entry].push('shared_buffers = ' + roundFix(new_value, 0) + 'MB');
	});

    tbody.append(row);

    // effective_cache_size
    row = gen_tr_start_pgsql('effective_cache_size', 'runtime-config-query.html#GUC-EFFECTIVE-CACHE-SIZE', pg_version);

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

        USAGE_FILE[entry].push('effective_cache_size = ' + roundFix(new_value, 0) + 'MB');


	});

    tbody.append(row);
    
    // work_mem
    row = gen_tr_start_pgsql('work_mem', 'runtime-config-resource.html#GUC-WORK-MEM', pg_version);
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

        USAGE_FILE[entry].push('work_mem = ' + roundFix(new_value, 0) + 'MB');
	});

    tbody.append(row);

    
    // maintenance_work_mem
    row = gen_tr_start_pgsql('maintenance_work_mem', 'runtime-config-resource.html#GUC-MAINTENANCE-WORK-MEM', pg_version);
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

        
        USAGE_FILE[entry].push('maintenance_work_mem = ' + roundFix(new_value, 0) + 'MB');
	});

    tbody.append(row);

	buffers_table.append(tbody);

	buffers_panel=$('<div>', { class : 'panel panel-default' });

	buffers_panel.append($('<div>', { class: 'panel-heading' }).append('Memory Configuration'));
	buffers_panel.append(buffers_table);



    $('#generated_data').empty();
    $('#generated_data').hide();


    // $('#generated_data').append(
    //     $('<div>', { class: "row"}).append(
    //                 $('<div>', { class : "col-md-12"}).append(
    //                         $('<h1>').append('PostgreSQL Configuration')
    //                     )
    //             )
    //     );

    // buffer stuff
    $('#generated_data').append(
            $('<div>', { class: "row"}).append(
                    $('<div>', { class : "col-md-12"})
                        .append(
                                $('<div>', { class : "page-header", id : 'pgsql-related' }).append (
                                        $('<h3>').append('PostgreSQL Related')
                                    )
                            )
                        .append(buffers_panel)
                )
        );



    // compute_checkpoint_related_configuration
    $('#generated_data').append(compute_checkpoint_related_configuration());

    $('#generated_data').append(
            generate_usage_stuff()
        );

    // OS stuff
    // $('#generated_data').append(
    //         $('<div>', { class: "row"}).append(
    //                 $('<div>', { class : "col-md-12"})
    //                     .append(
    //                             $('<div>', { class : "page-header", id : 'pgsql-related' }).append (
    //                                     $('<h3>').append('Operating System Related')
    //                                 )
    //                         )
    //                     .append(compute_sysctl_related_configuration())
    //             )
    //     );


    // columns and rows 

    hover_color = '#f5f5f5';

    $('td').mouseover(function () {
        $(this).siblings().css('background-color', hover_color);
        var ind = $(this).index();
        $('td:nth-child(' + (ind + 1) + ')').css('background-color', hover_color);
    });
    $('td').mouseleave(function () {
        $(this).siblings().css('background-color', '');
        var ind = $(this).index();
        $('td:nth-child(' + (ind + 1) + ')').css('background-color', '');
    });



    // scroll to results
    $('#generated_data').fadeIn(300);
    $('html,body').animate({ scrollTop: $('#pgsql-related').offset().top - 85 }, 'slow');


  });
});