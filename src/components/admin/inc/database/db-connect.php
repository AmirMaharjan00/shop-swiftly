<?php
    $servername = 'localhost';
    $username = 'root';
    $password = '';
    
    $conn = mysqli_connect( $servername, $username, $password );
    if( ! $conn ) die( 'Failed to establish connection with the server' );