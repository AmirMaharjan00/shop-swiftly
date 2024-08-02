import React, { useState, useEffect } from 'react'
import { useLocation  } from 'react-router-dom'
import { fetchFunction } from './functions'
import Header from './header'

export const Single = () => {
    const { state } = useLocation()
    const { ID } = state
    const [ allPosts, setAllPosts ] = useState([])
    const { post_image: image, post_title: title, post_excerpt: excerpt } = allPosts

    useEffect(() => {
        fetchFunction({
            action: 'select_where',
            tableIdentity: 'post',
            setterFunction: setAllPosts,
            post: ID
        })
    }, [])

    return (
        <>

            <Header />
            { allPosts && <div className='single-wrapper'>
                <div className='container'>
                    <div className='row'>
                        <div className='post-wrapper'>
                            <figure className='post-thumbnail-wrapper'>
                                <img src={ image } alt=""/>
                            </figure>
                            <div className='post-elements'>
                                <div className='element-header'>
                                    <h2 className='post-title'>{ title }</h2>
                                    <span className='product-home-url'>{ 'Visit Url' }</span>
                                    <div className='rating-wrapper'>
                                        <span className='product-rating'></span>
                                        <span className='total-product-rating'></span>
                                    </div>
                                </div>
                                <div className='element-details'>
                                    <span className='delivery-indicator'></span>
                                    <div className='product-properties'>
                                        <table>
                                            
                                        </table>
                                    </div>
                                </div>
                                <div className='element-excerpt'>
                                    <p className='post-excerpt'>{ excerpt }</p>
                                </div>
                            </div>
                            <div className='featured-offers-wrapper'>
                                { 'Current there are no offers for this product' }
                            </div>
                        </div>
                    </div>
                </div>
            </div> }
        </>
    );
}