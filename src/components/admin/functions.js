import React, { useState } from 'react'

/**
 * Get images from the local uploads directory
 * 
 * @since 1.0.0 
 */
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

/**
 * Function to handle outside click
 * 
 * @since 1.0.0
 */
export function elementOutsideClick( event ) {
    if( event.target ) {

    }
}

/**
 * Delete product or page popup
 * 
 * @since 1.0.0
 */
export const PostTypeDeletionPopup = ( props ) => {
    const { postType, post, setDeleteAction, setMainState, postDetails } = props

    /**
     * trash the post function
     * 
     * @since 1.0.0
     */
    const trashPost = () => {
        const FORMDATA = new FormData();
        FORMDATA.append( 'action', 'update' )
        FORMDATA.append( 'post', post )
        FORMDATA.append( 'table_identity', postType )
        FORMDATA.append( postType + '_title', postDetails[ postType + '_title' ] )
        FORMDATA.append( postType + '_excerpt', postDetails[ postType + '_excerpt' ] )
        FORMDATA.append( postType + '_image', postDetails[ postType + '_image' ] )
        FORMDATA.append( postType + '_status', 'trash' )
        if( postType === 'post' ) {
            FORMDATA.append( 'post_image', postDetails[ 'post_image' ] )
            FORMDATA.append( 'post_category', postDetails[ 'post_category' ] )
            FORMDATA.append( 'post_tags', postDetails[ 'post_tags' ] )
            FORMDATA.append( 'post_stock', postDetails[ 'post_stock' ] )
            FORMDATA.append( 'post_price', postDetails[ 'post_price' ] )
            FORMDATA.append( 'is_featured', postDetails[ 'is_featured' ] )
            FORMDATA.append( 'meta_data', postDetails[ 'meta_data' ] )
        }
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', {
            method : 'POST',
            body: FORMDATA
        })
        .then(( response ) => response.json() )
        .then(( data ) => setMainState( data ))
        setDeleteAction( false )
    }

    return (
        <div className="delete-popup-wrapper">
            <div className='delete-popup-content'>
                <h2 className="title">{ 'Are you sure you want to delete this ' + postType + ' ?' }</h2>
                <div className="delete-action-wrapper">
                    <button className="action positive" onClick={() => trashPost()}>{ 'Yes' }</button>
                    <button className="action negetive" onClick={() => setDeleteAction( false )}>{ 'No' }</button>
                </div>
            </div>
        </div>
    )
}
PostTypeDeletionPopup.defaultProps = {
    postType: 'post'
}