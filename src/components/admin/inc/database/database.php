<?php
/**
 * Class to handle all database actions
 * 
 * @package ShopSwiftly
 * @since 1.0.0
 */

 namespace ShopSwiftlyDatabase;

 if( ! class_exists( 'Database' ) ) :
    /**
     * Database class
     * 
     * @since 1.0.0
     */
    class Database {
        /**
         * Server Name
         * 
         * @since 1.0.0
         */
        public $servername = 'localhost';
        
        /**
         * Database Username
         * 
         * @since 1.0.0
         */
        public $username = 'root';

        /**
         * Database password
         * 
         * @since 1.0.0
         */
        public $password = '';

        /**
         * Database name
         * 
         * @since 1.0.0
         */
        public $database = 'shop_swiftly';

        /**
         * Database connection variable
         * 
         * @since 1.0.0
         */
        public $connection;

        /**
         * Method that gets instantiated when class is called
         * 
         * @since 1.0.0
         */
        public function __construct() {
            $this->connection = mysqli_connect( $this->servername, $this->username, $this->password, $this->database );
            if( ! $this->connection ) die( 'Failed to connect to database' );
            $this->create_table();
            // $insert_args = [
            //     'post_title'    =>  'Amir Maharjan',
            //     'post_excerpt'  =>  'Lorem Ipsum is a dummy text.',
            //     'post_category' =>  'af',
            //     'post_tags' =>  'fa',
            //     'post_image'    =>  'no image',
            //     'post_stock'    =>  50,
            //     'post_price'    =>  1000,
            //     'post_date' =>  100
            // ];
            // $insert_args = [
                // 'page_title'    =>  'Amir Maharjan',
                // 'page_excerpt'  =>  'Lorem Ipsum is a dummy text.',
                // 'page_image'    =>  'no image',
                // 'page_date' =>  100
            // ];
            // $insert_args = [
            //     'media_path'    =>  'Amir Maharjan',
            //     'media_date' =>  100
            // ];
            // $insert_args = [
            //     'taxonomy_title'    =>  'Amir Maharjan',
            //     'taxonomy_type' =>  '100',
            //     'taxonomy_excerpt' =>  '100',
            //     'taxonomy_image' =>  '100',
            //     'taxonomy_date' =>  100
            // ];
            // echo json_encode( $this->insert_into_table( 'pages', $insert_args ) );
        }

        /**
         * Tables to create when class is instantiated
         * 
         * @since 1.0.0
         */
        public function create_table () {
            $table_queries = [
                "CREATE TABLE swt_posts (
                    post_id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    post_title VARCHAR(255) NOT NULL,
                    post_excerpt LONGTEXT NOT NULL,
                    post_category VARCHAR(255) NOT NULL DEFAULT 'uncategorized',
                    post_tags VARCHAR(255) NOT NULL DEFAULT 'null',
                    post_image VARCHAR(255) NOT NULL,
                    post_stock INT(11) NOT NULL,
                    post_price INT(11) NOT NULL,
                    post_date BIGINT(20) NOT NULL
                )",
                "CREATE TABLE swt_pages (
                    page_id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    page_title VARCHAR(255) NOT NULL,
                    page_excerpt LONGTEXT NOT NULL,
                    page_image VARCHAR(255) NOT NULL,
                    page_date BIGINT(18) NOT NULL
                )",
                "CREATE TABLE swt_taxonomy (
                    taxonomy_id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    taxonomy_title VARCHAR(255) NOT NULL,
                    taxonomy_type varchar(255) NOT NULL,
                    taxonomy_excerpt LONGTEXT NOT NULL,
                    taxonomy_image VARCHAR(255) NOT NULL,
                    taxonomy_date INT(11) NOT NULL
                )",
                "CREATE TABLE swt_media (
                    media_id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    media_path LONGTEXT NOT NULL,
                    media_date INT(11) NOT NULL
                )",
                "CREATE TABLE swt_options (
                    option_id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    option_key LONGTEXT NOT NULL,
                    option_value LONGTEXT NOT NULL
                )"
            ];
            if( ! empty( $table_queries ) && is_array( $table_queries ) ):
                foreach( $table_queries as $query ) :
                    $table_result = mysqli_query( $this->connection, $query );
                    if( ! $table_result ) return;
                endforeach;
            endif;
        }

        /**
         * Insert into table
         * 
         * @since 1.0.0
         */
        public function insert_into_table( $type = '', $args = [] ) {
            if( $type && ! empty( $args ) && is_array( $args ) ) :
                $insert_query = $insert_result = '';
                switch( $type ) :
                    case 'page':
                        $insert_query = "INSERT INTO swt_pages ( page_title, page_excerpt, page_image, page_date ) VALUES ( '$args[page_title]', '$args[page_excerpt]', '$args[page_image]', $args[page_date] )";
                        break;
                    case 'media':
                        $insert_query = "INSERT INTO swt_media ( media_path, media_date ) VALUES ( '$args[media_path]', $args[media_date] )";
                        break;
                    case 'taxonomy':
                        $insert_query = "INSERT INTO swt_taxonomy ( taxonomy_title, taxonomy_type, taxonomy_excerpt, taxonomy_image, taxonomy_date ) VALUES ( 
                            '$args[taxonomy_title]', '$args[taxonomy_type]', '$args[taxonomy_excerpt]', '$args[taxonomy_image]', $args[taxonomy_date] )";
                        break;
                    default:
                        $insert_query = "INSERT INTO swt_posts ( post_title, post_excerpt, post_category, post_tags, post_image, post_stock, post_price, post_date ) VALUES ( 
                            '$args[post_title]', '$args[post_excerpt]', '$args[post_category]', '$args[post_tags]', '$args[post_image]', $args[post_stock], $args[post_price], $args[post_date] )";
                        break;
                endswitch;
                if( $insert_query ) :
                    $insert_result = mysqli_query( $this->connection, $insert_query );
                    if( ! $insert_result ) return;
                    return $insert_result;
                endif;
            endif;
        }

        /**
         * Get all data from specified table
         * 
         * @since 1.0.0
         * @param TableName
         */
        public function get_table_data( $table_name ) {
            $select_query = "SELECT * FROM $table_name";
            $select_result = mysqli_query( $this->connection, $select_query );
            if( ! $select_result ) return [];
            if( $select_result->num_rows > 0 ) :
                while( $row = mysqli_fetch_assoc( $select_result ) ) :
                    $data[] = $row;
                endwhile;
                return $data;
            endif;
        }
    }
 endif;