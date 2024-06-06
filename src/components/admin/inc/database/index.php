<?php
    header( "Access-Control-Allow-Origin: *" );
    header( "Access-Control-Allow-Headers: *" );

    include( 'database.php' );
    
    $database = new ShopSwiftlyDatabase\Database();
    $function_to_call = '';
    if( $_SERVER['REQUEST_METHOD'] == 'POST' ) :
        $parameters = file_get_contents( 'php://input' );
        $arguments = json_decode( $parameters, true );
        $insert_query = $database->insert_into_table( $arguments['post_type'], $arguments['params'] );
        if( $arguments['post_type'] == 'post' ) :
            $table = 'swt_posts';
        else :
            $table = 'swt_pages';
        endif;
        echo json_encode( $insert_query ? $database->get_table_data( $table ) : $arguments );
    else :
        if( ! empty( $_GET ) && is_array( $_GET ) ) :
            if( array_key_exists( 'swt_posts', $_GET ) ) :
                $function_to_call = $_GET['swt_posts'];
                // var_dump( $database->$function_to_call( 'swt_posts' ) );
                echo $database->$function_to_call( 'swt_posts' );
            endif;
    
            if( array_key_exists( 'swt_pages', $_GET ) ) :
                $function_to_call = $_GET['swt_pages'];
                // var_dump( $database->$function_to_call( 'swt_pages' ) );
                echo $database->$function_to_call( 'swt_pages' );
            endif;
        endif;
    endif;