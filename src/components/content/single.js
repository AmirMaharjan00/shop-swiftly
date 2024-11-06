import React, { useState, useEffect, useMemo, useContext, createContext } from 'react'
import { useLocation  } from 'react-router-dom'
import { fetchFunction } from './functions'
import Header from './header'
import Footer from './footer'
import { SectionWrapper, AddToCartButton } from './inc/extras'
import { usePostRelatedHooks } from './inc/hooks'
import { Link } from 'react-router-dom';
import { Sidebar } from './sidebar'

const SINGLECONTEXT = createContext( null );

export const Single = () => {
    const { state } = useLocation()
    const { ID } = state
    const [ allPosts, setAllPosts ] = useState([])
    const [ isUserloggedIn, setIsUserLoggedIn ] = useState( false )

    useEffect(() => {
        fetchFunction({
            action: 'select_where',
            tableIdentity: 'post',
            setterFunction: setAllPosts,
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

            <Header />
            <SINGLECONTEXT.Provider value={{ isUserloggedIn }}>
                <SingleContent post={ allPosts } />
                <RelatedProducts post={ allPosts } />
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
                { 'Current there are no offers for this product' }
                <AddToCartButton 
                    productId = { ID }
                />
                <Sidebar />
            </div>
        </div>
    </SectionWrapper>
}

/**
 * Related products
 * 
 * @since 1.0.0
 */
const RelatedProducts = ( props ) => {
    const [ allPosts, setAllPosts ] = useState([])
    const { post_category: category } = props.post
    const structuredCategory = category?.replace(',', '')
    const { getTheDate, getCategory } = usePostRelatedHooks()

    const relatedPosts = useMemo(() => {
        return allPosts.filter(( post ) => {
            const { post_category: _thisCat } = post
            return _thisCat.includes( structuredCategory )
        })
    }, [ allPosts ])

    useEffect(() => {
        fetchFunction({
            action: 'select',
            tableIdentity: 'post',
            setterFunction: setAllPosts
        })
    }, [])

    return <SectionWrapper main='related-products-section'>
        <div className='related-products-wrapper'>
            <div className='section-details'>
                <h2 className='section-header'>{ '# Related Products #' }</h2>
            </div>
            <div className='articles-wrapper'>
                {
                    relatedPosts?.map(( post, index ) => {
                        const { post_id: ID, post_image: image, post_title: title, post_excerpt: excerpt, post_date: date, post_status: status, post_category: categories } = post
                        if( status !== 'publish' ) return
                            let newCategories = getCategory( categories )
                            return <article className='post' key={ index }>
                                { ( image !== undefined || image !== null ) && <figure className='thumbnail-wrapper'>
                                    <img src={ image } className='post-thumbnail'/>
                                </figure> }
                                <div className='post-elements'>
                                    { title && <h2 className='post-title'><Link to='/single' state={{ ID: ID }}>{ title }</Link></h2> }
                                    <div className='post-meta'>
                                        { date && <span className='post-date'>{ getTheDate( date ) }</span> }
                                        <ul className='post-categories'>
                                            {
                                                newCategories.map(( cat, index ) => (
                                                    <li className='cat-item' key={ index }>{ cat }</li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                    { excerpt && <p className='post-excerpt'>{ excerpt.split(" ").slice(0, 10).join(" ") + "..." }</p> }
                                </div>
                            </article>
                    })
                }
            </div>
        </div>
    </SectionWrapper>
}

