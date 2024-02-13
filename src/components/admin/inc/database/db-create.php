<?php
    include 'db-connect.php';
    if( $conn ) :
        $create_table = 'CREATE TABLE IF NOT EXISTS '
    endif;