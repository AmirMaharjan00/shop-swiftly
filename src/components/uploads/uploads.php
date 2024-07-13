<html>
    <head></head>
    <body>
        <?php
            // var_dump( $_SERVER );
        ?>
        <form action="<?php echo $_SERVER['PHP_SELF']?>" method="post" enctype="multipart/form-data">
            Select image to upload:
            <input type="file" name="fileToUpload" id="fileToUpload" multiple>
            <input type="submit" value="Upload Image" name="submit">
        </form>
        <?php
            if( isset( $_POST['submit'] ) ) {
                $target_path = __DIR__ . '/';
                $image_path = $target_path . basename( $_FILES['fileToUpload']['name']);
                if( move_uploaded_file( $_FILES['fileToUpload']['tmp_name'], $image_path ) ) {
                    echo "File uploaded successfully!";  
                } else{  
                    echo "Sorry, file not uploaded, please try again!";  
                }  

            }
        ?>
    </body>
</html>