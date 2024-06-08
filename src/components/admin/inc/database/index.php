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
        switch( $arguments['post_type'] ):
            case 'post':
                $table = 'swt_posts';
                break;
            case 'page':
                $table = 'swt_pages';
                break;
            case 'category':
                $table = 'swt_category';
                break;
            case 'product_tag':
                $table = 'swt_tag';
                break;
        endswitch;
        echo json_encode( $insert_query ? $database->get_table_data( $table ) : $arguments );
    else :
        if( ! empty( $_GET ) && is_array( $_GET ) ) :
            if( array_key_exists( 'swt_posts', $_GET ) ) :
                $function_to_call = $_GET['swt_posts'];
                echo json_encode( $database->$function_to_call( 'swt_posts' ) );
            endif;
    
            if( array_key_exists( 'swt_pages', $_GET ) ) :
                $function_to_call = $_GET['swt_pages'];
                echo json_encode( $database->$function_to_call( 'swt_pages' ) );
            endif;

            if( array_key_exists( 'swt_category', $_GET ) ) :
                $function_to_call = $_GET['swt_category'];
                echo json_encode( $database->$function_to_call( 'swt_category' ) );
            endif;

            if( array_key_exists( 'swt_tag', $_GET ) ) :
                $function_to_call = $_GET['swt_tag'];
                echo json_encode( $database->$function_to_call( 'swt_tag' ) );
            endif;
        endif;
    endif;