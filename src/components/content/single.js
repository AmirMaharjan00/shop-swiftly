import React, { useState, useEffect, useMemo, useContext, createContext } from 'react'
import { useLocation  } from 'react-router-dom'
import { fetchFunction } from './functions'
import Header from './header'
import Footer from './footer'
import { SectionWrapper, AddToCartButton } from './inc/extras'
import { usePostRelatedHooks, usePosts } from './inc/hooks'
import { Link } from 'react-router-dom';
import { Sidebar } from './sidebar'
import { HOMECONTEXT } from '../../App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

const SINGLECONTEXT = createContext( null );

export const Single = () => {
    const { state } = useLocation()
    const { ID } = state
    const [ allPosts, setAllPosts ] = useState([])
    const [ isUserloggedIn, setIsUserLoggedIn ] = useState( false )

    const contextObject = {
        isUserloggedIn,
        allPosts
    }

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
            <Header homeContext={ HOMECONTEXT }/>
            <SINGLECONTEXT.Provider value={ contextObject }>
                <SingleContent />
                <RelatedProducts post={ allPosts } />
            </SINGLECONTEXT.Provider>
            <Footer />
        </>
    );
}

const SingleContent = () => {
    const homeContext = useContext( HOMECONTEXT )
    const singleContext = useContext( SINGLECONTEXT )
    const { allPosts } = singleContext
    const { setOverlay, overlay, compareActive, setCompareActive } = homeContext
    const { post_image: image, post_title: title, post_excerpt: excerpt, post_price: price, post_id: ID } = allPosts
    

    /**
     * Handle compare button click
     */
    const handleCompareClick = () => {
        setOverlay( ! overlay )
        setCompareActive( ! compareActive )
    }

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
                <button className="compare-button"onClick={ handleCompareClick }>{ 'Compare' }</button>
                { compareActive && <CompareProduct /> }
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
const RelatedProducts = () => {
    const [ allPosts, setAllPosts ] = useState([])
    const singleContext = useContext( SINGLECONTEXT )
    const { allPosts:post } = singleContext
    const { post_category: category } = post
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
                                                newCategories?.map(( cat, index ) => (
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

/**
 * Compare Product
 * 
 * @since 1.0.0
 */
const CompareProduct = () => {
    const singleContext = useContext( SINGLECONTEXT )
    const { allPosts:post } = singleContext
    const { post_id: ID } = post
    const [ compareCount, setCompareCount ] = useState( 1 )
    const [ showSelectProduct, setShowSelectProduct ] = useState( false )
    const { posts: products, getPostDetails } = usePosts( true )
    const { getCategory } = usePostRelatedHooks()
    const [ compareProducts, setCompareProducts ] = useState([ ID ])

    /* Handle Add Product */
    const handleAddProduct = () => {
        setShowSelectProduct( true )
    }

    /* Get all product titles */
    const productTitles = useMemo(() => {
        if( products.length > 0 ) {
            return products.reduce(( newValue, product ) => {
                let { post_title, post_id } = product
                if( ! compareProducts.includes( post_id ) ) newValue = { ...newValue, [post_id]: post_title }
                return newValue
            }, {})
        }
        return {}
    }, [ products, compareProducts ])

    /* Handle select on change */
    const handleNewProductSelect = ( event ) => {
        let value = event.target.value
        setCompareCount( compareCount + 1 )
        setShowSelectProduct( false )
        setCompareProducts([ ...compareProducts, value ])
        // console.log( value )
    }

    /* Handle compare remove */
    const handleCompareRemove = ( index ) => {
        setCompareCount( compareCount - 1 )
        setShowSelectProduct( false )
        setCompareProducts([ ...compareProducts.slice( 0, index ), ...compareProducts.slice( index + 1 ) ])
    }

    return <div className='compare-wrapper'>
        <div className='compare-elements'>
            {
                getPostDetails.length > 0 && compareProducts.map(( productId, index ) => {
                    let { post_title: title, post_price: price, post_stock: stock, post_category: category, post_excerpt: excerpt, post_image: image } = getPostDetails[productId]
                    return <article className='post' key={ index }>
                        <figure className='thumbnail-wrapper'>
                            <img src={ image } alt=''/>
                        </figure>
                        <div className='post-elements'>
                            <h2 className='post-title'>{ title }</h2>
                            <div className="price-category-wrapper">
                                <p className="post-price">{ 'Rs. ' + price }</p>
                                <p className="post-category">{ getCategory( category ) }</p>
                            </div>
                            <p className="post-stock">{ stock === 0 ? 'Out of Stock' : 'Stock: ' + stock }</p>
                            <p className="post-excerpt">{ excerpt?.split(" ").slice(0, 10).join(" ") + "..." }</p>
                            <AddToCartButton 
                                productId = { ID }
                            />
                        </div>
                        { compareCount !== 1 && <FontAwesomeIcon icon={ faCircleXmark } className='compare-remove' onClick={ () => handleCompareRemove( index ) }/> }
                    </article>
                })
            }
            { showSelectProduct && <div className='select-product-wrapper'>
                <select onChange={ handleNewProductSelect }>
                    {
                        Object.keys( productTitles ).length > 0 && Object.entries( productTitles ).map(([ id, title ]) => {
                            return <option value={ id }>{ title }</option>
                        })
                    }
                </select>
            </div> }
            <button className='add-product' onClick={ handleAddProduct }>{ 'Add Product' }</button>
        </div>
    </div>
}