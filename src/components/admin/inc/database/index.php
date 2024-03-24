<?php
    header( "Access-Control-Allow-Origin: *" );
    header( "Access-Control-Allow-Headers: *" );

    include( 'database.php' );
    $database = new ShopSwiftlyDatabase\Database();
    $function_to_call = '';
    
    // echo json_encode( $_GET );
    if( ! empty( $_GET ) && is_array( $_GET ) ) :
        if( array_key_exists( 'swt_posts', $_GET ) ) :
            $function_to_call = $_GET['swt_posts'];
            echo json_encode( $database->$function_to_call( 'swt_posts' ) );
        endif;

        if( array_key_exists( 'swt_pages', $_GET ) ) :
            $function_to_call = $_GET['swt_pages'];
            echo json_encode( $database->$function_to_call( 'swt_pages' ) );
        endif;
    endif;