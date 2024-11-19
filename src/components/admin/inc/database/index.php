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
                echo json_encode( $database->insert_into_table() );
            elseif( $_POST['action'] === 'update' ):
                echo json_encode( $database->update_table() );
            elseif( $_POST['action'] === 'select' ):
                echo json_encode( $database->get_table_data() );
            elseif( $_POST['action'] === 'select_where' ):
                echo json_encode( $database->swt_query() );
            elseif( $_POST['action'] === 'signature' ):
                echo json_encode( $database->signature() );
            elseif( $_POST['action'] === 'delete' ):
                echo json_encode( $database->delete() );
            elseif( $_POST['action'] === 'query' ):
                echo json_encode( $database->query() );
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