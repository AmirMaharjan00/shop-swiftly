import React, { useState, useEffect, useMemo, useContext, createContext } from 'react'
import { useLocation  } from 'react-router-dom'
import { fetchFunction } from './functions'
import Header from './header'
import Footer from './footer'
import { SectionWrapper } from './inc/extras'
import { Sidebar } from './sidebar'
import { HOMECONTEXT } from '../../App'

const SINGLECONTEXT = createContext( null );

export const Page = () => {
    const { state } = useLocation()
    const { ID } = state
    const [ allPages, setAllPages ] = useState([])
    const [ isUserloggedIn, setIsUserLoggedIn ] = useState( false )

    useEffect(() => {
        fetchFunction({
            action: 'select_where',
            tableIdentity: 'page',
            setterFunction: setAllPages,
            post: ID
        })
        if( sessionStorage.length > 0 ) {
            const userId = sessionStorage.getItem( 'userId' )
            const loggedIn = sessionStorage.getItem( 'loggedIn' )
            setIsUserLoggedIn( loggedIn === 'true' )
        }
    }, [])

    return (
        <>
            <Header homeContext={ HOMECONTEXT }/>
            <SINGLECONTEXT.Provider value={{ isUserloggedIn }}>
                <SingleContent post={ allPages } />
            </SINGLECONTEXT.Provider>
            <Footer />
        </>
    );
}

const SingleContent = ({ post }) => {
    const Global = useContext( SINGLECONTEXT )
    const { isUserloggedIn } = Global
    const { post_image: image, post_title: title, post_excerpt: excerpt, post_price: price, post_id: ID } = post

    return <SectionWrapper main='single-wrapper'>
        <div className='post-wrapper'>
            <figure className='post-thumbnail-wrapper'>
                <img src={ image } alt=""/>
            </figure>
            <div className='post-elements'>
                <div className='element-header'>
                    <h2 className='post-title'>{ title }</h2>
                    <span className='post-price'>{ "Rs. " + price }</span>
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
                <Sidebar />
            </div>
        </div>
    </SectionWrapper>
}