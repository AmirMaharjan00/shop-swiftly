export function getImages() {
    const FORMDATA = new FormData();
    FORMDATA.append( 'post_type', 'media' )
    fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', {
        method : 'POST',
        body: FORMDATA
    })
    const images = require.context( '../uploads', true );
    return images
}

export function elementOutsideClick( event ) {
    console.log( event )
    if( event.target ) {

    }
}