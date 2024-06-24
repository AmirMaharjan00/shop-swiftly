import React, { useState, useEffect } from 'react'
import MediaUpload from './media-upload';
const images = require.context('./assets/images', true);
const IMAGELIST = images.keys().map(image => images(image));

export default function Media () {
    const [ files, setFiles ] = useState()

    useEffect(() => {
        if( files === undefined ) return;
        Object.entries( files ).map(([ index, media ]) => {
            let  bodyParams = {
                'media_path': '',
                'media_name': media.name,
                'media_size': media.size,
                'media_type': media.type
            }
            var apiParameters = {
                method: 'POST',
                body: JSON.stringify({
                    'params' : bodyParams,
                    'post_type' : 'media'
                })
            }
            fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', apiParameters )
            .then(( result ) => result.json())
            .then( ( data ) => { console.log( data ) } )
        })
        // console.log( files )
    }, [ files ])
    
    /**
     * Set the uplooaded files
     * 
     * @since 1.0.0
     */
    const handleFilesUpload = ( uploads ) => {
        setFiles( uploads )
    }

    return (
        <section className="media-wrapper">
            <div className='title-wraper'>
                <h2 className='title'>{ 'Upload New Media' }</h2>
            </div>
            <MediaUpload 
                onFilesSelect = { handleFilesUpload }
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