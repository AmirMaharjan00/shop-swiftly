<?php
    header( "Access-Control-Allow-Origin: *" );
    header( "Access-Control-Allow-Headers: *" );

    include( 'database.php' );
    
    $database = new ShopSwiftlyDatabase\Database();
    $function_to_call = '';

    if( $_SERVER['REQUEST_METHOD'] == 'POST' ) :
        $parameters = file_get_contents( 'php://input' );
        $arguments = json_decode( $parameters, true );
        if( array_key_exists( 'post_type', $_POST ) && $_POST['post_type'] == 'media' ) :
            $database->upload();
        else:
            if( $_POST['action'] == 'insert' ) :
                $insert_query = $database->insert_into_table();
                switch( $_POST['post_type'] ):
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
                endswitch;
                echo json_encode( $insert_query ? $database->get_table_data( $table ) : $arguments );
            elseif( $_POST['action'] == 'update' ):
                echo json_encode( $database->update_table() );
            endif;
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