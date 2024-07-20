import React, { useState, useEffect } from 'react'
import MediaUpload from './media-upload';
import { getImages } from './functions'

export default function Media () {
    const [ imageList, setImageList ] = useState([])

    useEffect(() => {
        const images = getImages()
        setImageList( images.keys().map(image => images(image)) )
    }, [])

    return (
        <section className="media-wrapper">
            <div className='title-wraper'>
                <h2 className='title'>{ 'Upload New Media' }</h2>
            </div>
            <MediaUpload />
            <MediaCollection images={ imageList }/>
        </section>
    );
}

export const MediaCollection = ({ images }) => {
    return (
        <div className='media-collection-wrapper'>
            {
                images.map( ( current, index ) => {
                    return ( 
                        <figure className='image-wrapper' key={ index }>
                            <img src={ current } className='thumb' alt=''/>
                        </figure>
                    )
                })
            }
        </div>
    )
}

MediaCollection.defaultProps = {
    images: []
}