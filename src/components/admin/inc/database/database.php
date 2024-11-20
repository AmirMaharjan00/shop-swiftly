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
                    post_image LONGTEXT NOT NULL,
                    post_stock INT(11) NOT NULL,
                    post_price INT(11) NOT NULL,
                    post_date BIGINT(20) NOT NULL,
                    is_featured BOOLEAN NOT NULL,
                    meta_data LONGTEXT NOT NULL,
                    post_status VARCHAR(255) NOT NULL DEFAULT 'draft',
                    FOREIGN KEY (`post_category`) REFERENCES swt_category(`category_id`),
                    FOREIGN KEY (`post_tags`) REFERENCES swt_tag(`tag_id`)
                )",
                "CREATE TABLE IF NOT EXISTS swt_pages (
                    page_id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    page_title VARCHAR(255) NOT NULL,
                    page_excerpt LONGTEXT NOT NULL,
                    page_image LONGTEXT NOT NULL,
                    page_date BIGINT(18) NOT NULL,
                    page_status VARCHAR(255) NOT NULL DEFAULT 'draft'
                )",
                "CREATE TABLE IF NOT EXISTS swt_options (
                    option_id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    option_key LONGTEXT NOT NULL,
                    option_value LONGTEXT NOT NULL
                )",
                "CREATE TABLE IF NOT EXISTS swt_users (
                    user_id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    user_name varchar(255) NOT NULL,
                    user_password LONGTEXT NOT NULL,
                    user_email varchar(255) NOT NULL,
                    user_role varchar(255) NOT NULL,
                    registered_date BIGINT(18) NOT NULL
                )",
                "CREATE TABLE IF NOT EXISTS swt_orders (
                    order_id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    order_date BIGINT(18) NOT NULL,
                    product_id varchar(255) NOT NULL,
                    user_id LONGTEXT NOT NULL,
                    order_price INT(11) NOT NULL,
                    order_quantity INT(11) NOT NULL,
                    order_status varchar(255) NOT NULL DEFAULT 'pending',
                    FOREIGN KEY (`user_id`) REFERENCES swt_users(`user_id`),
                    FOREIGN KEY (`product_id`) REFERENCES swt_posts(`post_id`)
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
        public function insert_into_table() {
            if( count( $_POST ) <= 0 ) return;
            $insert_query = $insert_result = '';
            switch( $_POST['post_type'] ) :
                case 'page':
                    $insert_query = "INSERT INTO swt_pages ( page_title, page_excerpt, page_image, page_date, page_status ) VALUES ( '$_POST[page_title]', '$_POST[page_excerpt]', '$_POST[page_image]', '$_POST[page_date]', '$_POST[page_status]' )";
                    break;
                case 'category':
                    $insert_query = "INSERT INTO swt_category ( category_title, category_slug, category_date, category_excerpt ) VALUES ( '$_POST[category_title]', '$_POST[category_slug]', '$_POST[category_date]', '$_POST[category_excerpt]' )";
                    break;
                case 'tag':
                    $insert_query = "INSERT INTO swt_tag ( tag_title, tag_slug, tag_date, tag_excerpt ) VALUES ( '$_POST[tag_title]', '$_POST[tag_slug]', '$_POST[tag_date]', '$_POST[tag_excerpt]' )";
                    break;
                case 'user':
                    $insert_query = "INSERT INTO swt_users ( user_name, user_password, user_email, user_role, registered_date ) VALUES ( '$_POST[user_name]', '$_POST[user_password]', '$_POST[user_email]', '$_POST[user_role]', '$_POST[registered_date]' )";
                    break;
                case 'options':
                    $insert_query = "INSERT INTO swt_options ( option_key, option_value ) VALUES ( '$_POST[option_key]', '$_POST[option_value]' )";
                    break;
                case 'order':
                    $insert_query = "INSERT INTO swt_orders ( order_date, product_id, user_id, order_price, order_quantity, order_status ) VALUES ( '$_POST[order_date]', '$_POST[product_id]', '$_POST[user_id]', '$_POST[order_price]', '$_POST[order_quantity]', '$_POST[order_status]' )";
                    break;
                default:
                    $insert_query = "INSERT INTO swt_posts ( post_title, post_excerpt, post_category, post_tags, post_image, post_stock, post_price, post_date, post_status, is_featured, meta_data ) VALUES ( '$_POST[post_title]', '$_POST[post_excerpt]', '$_POST[post_category]', '$_POST[post_tags]', '$_POST[post_image]', '$_POST[post_stock]', '$_POST[post_price]', '$_POST[post_date]', '$_POST[post_status]', '$_POST[is_featured]', '$_POST[meta_data]' )";
                    break;
            endswitch;
            if( $insert_query ) :
                $insert_result = mysqli_query( $this->connection, $insert_query );
                if( ! $insert_result ) return [ 'result' => $insert_query ];
                return $this->get_table_data();
            endif;
        }

        /**
         * Get all data from specified table
         * 
         * @since 1.0.0
         * @param TableName
         */
        public function get_table_data( $all = false ) {
            $post = isset( $_POST['post'] ) ? $_POST['post'] : false;
            $table_identity = $_POST['table_identity'];
            $id_attr = $table_identity . '_id';
            $table_name = $this->get_table_name( $table_identity );
            if( $post && ! $all ) :
                $select_query = "SELECT * FROM $table_name WHERE $id_attr=$post";
            else:
                $select_query = "SELECT * FROM $table_name";
            endif;
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

        /**
         * Uploads the images in uploads directory
         * 
         * @since 1.0.0
         */
        public function upload() {
            $target_path = dirname( dirname( dirname( __DIR__ ) ) ) . '/uploads/';
            if( ! is_dir( $target_path ) ) mkdir( $target_path );
            if( count( $_FILES ) > 0 ) :
                $file_keys = array_keys( $_FILES );
                if( count( $file_keys ) > 0 ) :
                    $uploads = [];
                    foreach( $file_keys as $file_key ) :
                        if( strpos( $file_key, 'images_' ) !== false ) :
                            $uploads[] = $file_key;
                        endif;
                    endforeach;
                    if( count( $uploads ) > 0 ) :
                        foreach( $uploads as $image ) :
                            $image_path = $target_path . basename( $_FILES[ $image ]['name']);
                            if( move_uploaded_file( $_FILES[ $image ]['tmp_name'], $image_path ) ) {
                                echo "File uploaded successfully!";  
                            } else{  
                                echo "Sorry, file not uploaded, please try again!";  
                            }  
                        endforeach;
                    endif;
                    return $_FILES;
                endif;
            endif;
        }

        /**
         * Function to update table
         * 
         * @since 1.0.0
         */
        public function update_table() {
            if( count( $_POST ) > 0 ) :
                $post = $_POST['post'];
                $table_identity = $_POST['table_identity'];
                $table_name = $this->get_table_name( $table_identity );
                switch( $table_identity ) {
                    case 'page':
                        $update_query = "UPDATE $table_name SET page_title='$_POST[page_title]', page_excerpt='$_POST[page_excerpt]', page_status='$_POST[page_status]', page_image='$_POST[page_image]' WHERE page_id=$post";
                        break;
                    case 'options':
                        $update_query = "UPDATE $table_name SET option_key='$_POST[option_key]', option_value='$_POST[option_value]' WHERE option_key='$post'";
                        break;
                    case 'user':
                        $update_query = "UPDATE $table_name SET user_name='$_POST[user_name]', user_password='$_POST[user_password]', user_email='$_POST[user_email]', user_role='$_POST[user_role]' WHERE user_id='$post'";
                        break;
                    default:
                        $update_query = "UPDATE $table_name SET post_title='$_POST[post_title]', post_excerpt='$_POST[post_excerpt]', post_category='$_POST[post_category]', post_tags='$_POST[post_tags]', post_image='$_POST[post_image]', post_stock=$_POST[post_stock], post_price=$_POST[post_price], post_status='$_POST[post_status]', is_featured='$_POST[is_featured]', meta_data='$_POST[meta_data]' WHERE post_id=$post";
                }
                $update_result = mysqli_query( $this->connection, $update_query );
                if( ! $update_result ) return [ 'result' => $update_query ];
                return $this->get_table_data( true );
            endif;
        }

        /**
         * Get table name
         * 
         * @since 1.0.0
         */
        public function get_table_name( $case ) {
            if( ! $case ) return;
            switch( $case ):
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
                case 'order':
                    $table = 'swt_orders';
                    break;
            endswitch;
            return $table;
        }

        /**
         * Select from data with where clause
         * 
         * @since 1.0.0
         */
        public function swt_query() {
            $post = isset( $_POST['post'] ) ? $_POST['post'] : false;
            $table_identity = $_POST['table_identity'];
            $id_attr = $table_identity . '_id';
            $where_clause = isset( $_POST['where_clause'] ) ? $_POST['where_clause'] : false;
            $table_name = $this->get_table_name( $table_identity );
            if( $where_clause ) {
                $select_query = "SELECT * FROM $table_name WHERE $where_clause";
            } else {
                $select_query = "SELECT * FROM $table_name WHERE $id_attr=$post";
            }
            $select_result = mysqli_query( $this->connection, $select_query );
            if( ! $select_result ) return [ 'result' => $select_result ];
            if( $select_result->num_rows > 0 ) :
                while( $row = mysqli_fetch_assoc( $select_result ) ) :
                    $data = $row;
                endwhile;
                return $data;
            else:
                return [];
            endif;
        }

        /**
         * Create signature for esewa
         * 
         * @since 1.0.0
         */
        public function signature() {
            $s = hash_hmac('sha256', 'Message', 'secret', true);
            return base64_encode($s); 
        }

        /**
         * delete from database
         * 
         * @since 1.0.0
         */
        public function delete() {
            if( count( $_POST ) > 0 ) :
                $post = $_POST['post'];
                $table_identity = $_POST['table_identity'];
                $table_name = $this->get_table_name( $table_identity );
                switch( $table_identity ) {
                    case 'page':
                        $update_query = "DELETE FROM $table_name WHERE page_id=$post";
                        break;
                    case 'options':
                        $update_query = "DELETE FROM $table_name WHERE option_key='$post'";
                        break;
                    case 'user':
                        $update_query = "DELETE FROM $table_name WHERE user_id='$post'";
                        break;
                    default:
                        $update_query = "DELETE FROM $table_name WHERE post_id=$post";
                }
                $delete_result = mysqli_query( $this->connection, $update_query );
                if( ! $delete_result ) return [ 'result' => $update_query ];
                return $delete_result;
            endif;
        }

         /**
         * Execute the give query
         *
         * @since 1.0.0
         */
        public function query() {
            $result = mysqli_query( $this->connection, $_POST['query'] );
            if( ! $result ) return [ 'result' => $select_query ];
            if( is_bool( $result ) ) return $result;
            if( $result->num_rows > 0 ) :
                while( $row = mysqli_fetch_assoc( $result ) ) :
                    $data[] = $row;
                endwhile;
                return $data;
            else:
                return [];
            endif;
        }
    }
 endif;