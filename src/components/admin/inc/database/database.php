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
        }

        /**
         * Tables to create when class is instantiated
         * 
         * @since 1.0.0
         */
        public function create_table () {
            $table_queries = [
                "CREATE TABLE IF NOT EXISTS swt_category (
                    category_id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    category_title VARCHAR(255) NOT NULL,
                    category_excerpt LONGTEXT NOT NULL,
                    category_slug VARCHAR(255) NOT NULL,
                    category_date BIGINT(20) NOT NULL
                )",
                "CREATE TABLE IF NOT EXISTS swt_tag (
                    tag_id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    tag_title VARCHAR(255) NOT NULL,
                    tag_excerpt LONGTEXT NOT NULL,
                    tag_slug VARCHAR(255) NOT NULL,
                    tag_date BIGINT(20) NOT NULL
                )",
                "CREATE TABLE IF NOT EXISTS swt_posts (
                    post_id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    post_title VARCHAR(255) NOT NULL,
                    post_excerpt LONGTEXT NOT NULL,
                    post_category VARCHAR(255) NOT NULL,
                    post_tags VARCHAR(255) NOT NULL,
                    post_image VARCHAR(255) NOT NULL,
                    post_stock INT(11) NOT NULL,
                    post_price INT(11) NOT NULL,
                    post_date BIGINT(20) NOT NULL
                    -- FOREIGN KEY (post_category) REFERENCES swt_category(category_id),
                    -- FOREIGN KEY (post_tags) REFERENCES swt_tag(tag_id)
                )",
                "CREATE TABLE IF NOT EXISTS swt_pages (
                    page_id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    page_title VARCHAR(255) NOT NULL,
                    page_excerpt LONGTEXT NOT NULL,
                    page_image VARCHAR(255) NOT NULL,
                    page_date BIGINT(18) NOT NULL
                )",
                "CREATE TABLE IF NOT EXISTS swt_media (
                    media_id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    media_path LONGTEXT NOT NULL,
                    media_name LONGTEXT NOT NULL,
                    media_size int(11) NOT NULL,
                    media_type VARCHAR(255) NOT NULL
                )",
                "CREATE TABLE IF NOT EXISTS swt_options (
                    option_id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    option_key LONGTEXT NOT NULL,
                    option_value LONGTEXT NOT NULL
                )",
                "CREATE TABLE IF NOT EXISTS swt_users (
                    user_id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    user_name LONGTEXT NOT NULL,
                    user_password LONGTEXT NOT NULL,
                    user_email LONGTEXT NOT NULL,
                    user_role LONGTEXT NOT NULL,
                    registered_date LONGTEXT NOT NULL
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
                    case 'category':
                        $insert_query = "INSERT INTO swt_category ( category_title, category_slug, category_date, category_excerpt ) VALUES ( '$args[category_title]', '$args[category_slug]', '$args[category_date]', '$args[category_excerpt]' )";
                        break;
                    case 'tag':
                        $insert_query = "INSERT INTO swt_tag ( tag_title, tag_slug, tag_date, tag_excerpt ) VALUES ( '$args[tag_title]', '$args[tag_slug]', '$args[tag_date]', '$args[tag_excerpt]' )";
                        break;
                    case 'user':
                        $insert_query = "INSERT INTO swt_users ( user_name, user_password, user_email, user_role, registered_date ) VALUES ( '$args[user_name]', '$args[user_password]', '$args[user_email]', '$args[user_role]', '$args[registered_date]' )";
                        break;
                    case 'options':
                        $insert_query = "INSERT INTO swt_options ( option_key, option_value ) VALUES ( '$args[option_key]', '$args[option_value]' )";
                        break;
                    case 'media':
                        $insert_query = "INSERT INTO swt_media ( media_path, media_name, media_size, media_type ) VALUES ( '$args[media_path]', '$args[media_name]', '$args[media_size]', '$args[media_type]' )";
                        break;
                    default:
                        $insert_query = "INSERT INTO swt_posts ( post_title, post_excerpt, post_category, post_tags, post_image, post_stock, post_price, post_date ) VALUES ( '$args[post_title]', '$args[post_excerpt]', '$args[post_category]', '$args[post_tags]', '$args[post_image]', $args[post_stock], $args[post_price], $args[post_date] )";
                        break;
                endswitch;
                if( $insert_query ) :
                    $insert_result = mysqli_query( $this->connection, $insert_query );
                    if( ! $insert_result ) return [ 'result' => $insert_query ];
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
            if( ! $select_result ) return [ 'result' => $select_result ];
            if( $select_result->num_rows > 0 ) :
                while( $row = mysqli_fetch_assoc( $select_result ) ) :
                    $data[] = $row;
                endwhile;
                return $data;
            else:
                return [];
            endif;
        }
    }
 endif;