import React, { useState, useEffect } from 'react'
import MediaUpload from './media-upload';
import { getImages } from './functions'

export default function Media () {
    return (
        <section className="media-wrapper">
            <div className='title-wraper'>
                <h2 className='title'>{ 'Upload New Media' }</h2>
            </div>
            <MediaUpload />
            <MediaCollection />
        </section>
    );
}

export const MediaCollection = ({ setImage }) => {
    const [ imageList, setImageList ] = useState([])

    useEffect(() => {
        const images = getImages()
        setImageList( images.keys().map(image => images(image)) )
    }, [])

    return (
        <div className='media-collection-wrapper'>
            {
                imageList.map( ( current, index ) => {
                    return ( 
                        <figure className='image-wrapper' key={ index } onClick={() => setImage( current )}>
                            <img src={ current } className='thumb' alt=''/>
                        </figure>
                    )
                })
            }
        </div>
    )
}

MediaCollection.defaultProps = {
    setImage: function(){}
}