import react, { useState, useEffect } from 'react'
import { GetTaxonomy, fetchFunction } from './functions'

 export const Archive = () => {
    const [ posts, setPosts ] = useState([])

    useEffect(() => {
        fetchFunction({
            action: 'select',
            tableIdentity: 'post',
            setterFunction: setPosts
        })
    }, [])

    return (
        <>
            {
                posts.map(( current, index ) => {
                    const { post_title: title, post_image: image, post_excerpt: excerpt } = current
                    return <article className='post' key={ index }>
                        <figure className='thumbnail-wrapper'>
                            <img src={ image } alt=''/>
                        </figure>
                        <div className='post-elements'>
                            <h2 className='post-title'>{ title }</h2>
                            <p className="post-excerpt">{ excerpt }</p>
                        </div>
                    </article>
                })
            }
        </>
    );
}