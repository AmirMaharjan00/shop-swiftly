<?php
    header( "Access-Control-Allow-Origin: *" );
    header( "Access-Control-Allow-Headers: *" );

    include( 'database.php' );
    
    $database = new ShopSwiftlyDatabase\Database();
    $function_to_call = '';
    if( $_SERVER['REQUEST_METHOD'] == 'POST' ) :
        echo $_SERVER['REQUEST_METHOD'];
    //     $parameters = file_get_contents( 'php://input' );
    //     $insert_query = $database->insert_into_table( 'posts', json_decode( $parameters, true ) );
    //     echo json_encode( $insert_query ? $database->get_table_data( 'swt_posts' ) : $parameters );
    else :
        if( ! empty( $_GET ) && is_array( $_GET ) ) :
            if( array_key_exists( 'swt_posts', $_GET ) ) :
                $function_to_call = $_GET['swt_posts'];
                //  var_dump( $function_to_call );
                echo json_encode( $database->$function_to_call( 'swt_posts' ) );
            endif;
    
            // if( array_key_exists( 'swt_pages', $_GET ) ) :
            //     $function_to_call = $_GET['swt_pages'];
            //     echo json_encode( $database->$function_to_call( 'swt_pages' ) );
            // endif;
        endif;
    endif;