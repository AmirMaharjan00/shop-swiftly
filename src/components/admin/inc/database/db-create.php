<?php
    include 'db-connect.php';
    if( $conn ) :
        // product table
        $product_table = "CREATE TABLE IF NOT EXISTS swt_products (
            id INT(11) AUTO_INCREMENT PRIMARY KEY,
            product_title varchar(255) NOT NULL,
            product_excerpt LONGTEXT NOT NULL,
            product_stock INT(11) NOT NULL,
            product_price INT(11) NOT NULL,
            product_date INT(11) NOT NULL
        )";
        $product_query = mysqli_query( $conn, $product_table );

        // page table
        $page_table = "CREATE TABLE IF NOT EXISTS swt_pages (
            id INT(11) AUTO_INCREMENT PRIMARY KEY,
            page_title varchar(255) NOT NULL,
            page_excerpt LONGTEXT NOT NULL,
            page_stock INT(11) NOT NULL,
            page_price INT(11) NOT NULL,
            page_date INT(11) NOT NULL
        )";
        $page_query = mysqli_query( $conn, $page_table );
        
        // media table
        $media_table = "CREATE TABLE IF NOT EXISTS swt_media (
            id INT(11) AUTO_INCREMENT PRIMARY KEY,
            media_title varchar(255) NOT NULL,
            media_excerpt LONGTEXT NOT NULL,
            media_stock INT(11) NOT NULL,
            media_price INT(11) NOT NULL,
            media_date INT(11) NOT NULL
        )";
        $media_query = mysqli_query( $conn, $media_table );
    endif;