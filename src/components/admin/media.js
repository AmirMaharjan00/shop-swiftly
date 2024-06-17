import React from 'react'
import MediaUpload from './media-upload';
const images = require.context('./assets/images', true);
const IMAGELIST = images.keys().map(image => images(image));

export default function Media () {
    return (
        <section className="media-wrapper">
            <div className='title-wraper'>
                <h2 className='title'>{ 'Upload New Media' }</h2>
            </div>
            <MediaUpload />
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