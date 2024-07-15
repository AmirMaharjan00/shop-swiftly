import React, { useState, useEffect } from 'react'
import MediaUpload from './media-upload';
import { json } from 'react-router-dom';
const images = require.context('./assets/images', true);
const IMAGELIST = images.keys().map(image => images(image));

export default function Media () {
    const [ files, setFiles ] = useState([])

    useEffect(() => {
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php?swt_media=get_table_data' )
        .then(( result ) => result.json())
        .then( ( data ) => { setFiles( data ) } )
    }, [])

    /**
     * Set the uplooaded files
     * 
     * @since 1.0.0
     */
    const handleFilesUpload = ( uploads ) => {
        Object.values( uploads ).map( current => {
            const MEDIAFIELDS = {
                'media_path': URL.createObjectURL( current ),
                'media_name': current.name,
                'media_size': current.size,
                'media_type': current.type
            }
            var apiParameters = {
                method: 'POST',
                body: JSON.stringify({
                    'params' : MEDIAFIELDS,
                    'post_type' : 'media'
                }),
            }
            fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', apiParameters )
            .then(( result ) => result.json())
            .then( ( data ) => { setFiles( data ) } )
        } )
    }

    return (
        <section className="media-wrapper">
            <div className='title-wraper'>
                <h2 className='title'>{ 'Upload New Media' }</h2>
            </div>
            <MediaUpload 
                onFilesSelect = { handleFilesUpload }
            />
            <MediaCollection images={ files }/>
        </section>
    );
}

export const MediaCollection = ({ images }) => {
    return (
        <div className='media-collection-wrapper'>
            {
                images.map( ( current, index ) => {
                    let url = current.media_path
                    return ( 
                        <figure className='image-wrapper' key={ index }>
                            <img src={ url } className='thumb'/>
                        </figure>
                    )
                })
            }
        </div>
    )
}