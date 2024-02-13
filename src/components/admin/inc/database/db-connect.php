<?php
    $servername = 'localhost';
    $username = 'root';
    $password = '';
    $database = 'shop_swiftly';

    $conn = mysqli_connect( $servername, $username, $password, $database );
    if( ! $conn ) die( 'Failed to establish connection with the server' );