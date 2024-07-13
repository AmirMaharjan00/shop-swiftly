import React, { useState, useEffect } from 'react'
import MediaUpload from './media-upload';
import { json } from 'react-router-dom';
const images = require.context('./assets/images', true);
const IMAGELIST = images.keys().map(image => images(image));

export default function Media () {
    const [ files, setFiles ] = useState([])
    const [ uploads, setUploads ] = useState([])

    useEffect(() => {
        
    }, [ uploads ])
    
    /**
     * Set the uplooaded files
     * 
     * @since 1.0.0
     */
    const handleFilesUpload = ( uploads ) => {
        setUploads( uploads )
    }

    /**
     * Form data
     * 
     * @since 1.0.0
     */
    const handleFormData = async ( event ) => {
        event.preventDefault()
        // "use server";
        console.log( event )

        // var apiParameters = {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         'params' : test,
        //         'post_type' : 'upload'
        //     }),
        //     headers: { 'content-type': 'multipart/form-data' }
        // }
        // fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', apiParameters )
        // .then(( result ) => result.json())
        // .then( ( data ) => { console.log( data ) } )
    }

    return (
        <section className="media-wrapper">
            <div className='title-wraper'>
                <h2 className='title'>{ 'Upload New Media' }</h2>
            </div>
            <MediaUpload 
                onFilesSelect = { handleFilesUpload }
                setFormData = { handleFormData }
            />
            <div className='media-collection-wrapper'>
                {
                    IMAGELIST.map( ( current, index ) => {
                        return ( 
                            <figure className='image-wrapper' key={ index }>
                                <img src={ current } className='thumb'/>
                            </figure>
                        )
                    })
                }
            </div>
        </section>
    );
}