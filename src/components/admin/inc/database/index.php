<?php
    header( "Access-Control-Allow-Origin: *" );
    header( "Access-Control-Allow-Headers: *" );

    include( 'database.php' );
    
    $database = new ShopSwiftlyDatabase\Database();
    $function_to_call = '';

    if( $_SERVER['REQUEST_METHOD'] == 'POST' ) :
        $parameters = file_get_contents( 'php://input' );
        $arguments = json_decode( $parameters, true );
        if( $arguments['post_type'] != 'upload' ) :
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
                case 'tag':
                    $table = 'swt_tag';
                    break;
                case 'user':
                    $table = 'swt_users';
                    break;
                case 'options':
                    $table = 'swt_options';
                    break;
                case 'media':
                    $table = 'swt_media';
                    break;
            endswitch;
            echo json_encode( $insert_query ? $database->get_table_data( $table ) : $arguments );
        else: 
            var_dump( $arguments['params'] );
            // if( ! empty( $arguments['params'] ) && is_array( $arguments['params'] ) ) :
            //     foreach( $arguments['params']['images'] as $image_name ) :
                    var_dump( $database->upload( $image_name ) );
            //     endforeach;
            // endif;
            // var_dump( $arguments['params'] );
            // echo json_encode( $arguments['params'] );
        endif;
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

            if( array_key_exists( 'swt_users', $_GET ) ) :
                $function_to_call = $_GET['swt_users'];
                echo json_encode( $database->$function_to_call( 'swt_users' ) );
            endif;

            if( array_key_exists( 'swt_options', $_GET ) ) :
                $function_to_call = $_GET['swt_options'];
                echo json_encode( $database->$function_to_call( 'swt_options' ) );
            endif;

            if( array_key_exists( 'swt_media', $_GET ) ) :
                $function_to_call = $_GET['swt_media'];
                echo json_encode( $database->$function_to_call( 'swt_media' ) );
            endif;
        endif;
    endif;