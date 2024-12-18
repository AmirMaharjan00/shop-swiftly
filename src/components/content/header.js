import React, { useState, useEffect, useContext, createContext } from 'react'
import './assets/css/main.css'
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faSun, faMoon, faCartShopping, faPlus, faMinus, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { SignIn } from './inc/helpers';
import { fetchFunction } from './functions'
import { useSession } from './inc/hooks'
import { HOMECONTEXT } from '../../App'
const HEADERCONTEXT = createContext( null )

export default function Header() {
    const [ getPages, setPages ] = useState([]);
    const [ isLightMode, setIsLightMode ] = useState( true )
    const [ isSignInActive, setIsSignInActive ] = useState( false )
    const [ userDetails, setUserDetails ] = useState({})
    const [ isUserLoggedIn, setIsUserLoggedIn ] = useState( false )
    const [ isUserDropdownActive, setIsUserDropdownActive ] = useState( false )
    const { user_name: userName } = userDetails
    const homeContext = useContext( HOMECONTEXT )
    const { isAdmin, isSubscriber } = homeContext
    let dashbaordLInk = '/swt-user'
    if( isAdmin ) dashbaordLInk = '/swt-admin'
    if( isSubscriber ) dashbaordLInk = '/swt-user'

    const headerContext = {
        isLightMode,
        setIsLightMode,
        isSignInActive,
        setIsSignInActive,
        isUserLoggedIn
    }

    useEffect(() => {
        const FORMDATA = new FormData()
        FORMDATA.append( 'action', 'select' )
        FORMDATA.append( 'table_identity', 'page' )
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', {
            method: 'POST',
            body: FORMDATA
        })
        .then(( result ) => result.json())
        .then( ( data ) => { setPages( data ) } )
    }, [])

    useEffect(() => {
        if( sessionStorage.length > 0 ) {
            const userId = sessionStorage.getItem( 'userId' )
            const loggedIn = sessionStorage.getItem( 'loggedIn' )
            setIsUserLoggedIn( loggedIn === 'true' )
            fetchFunction({
                action: 'select_where',
                tableIdentity: 'user',
                post: userId,
                setterFunction: setUserDetails
            })
        }
    }, [ isSignInActive ])

    /**
     * Handle user click
     * 
     * @since 1.0.0
     */
    const handleUserClick = () => {
        setIsUserDropdownActive( ! isUserDropdownActive )
    }

    /**
     * Handle logout click
     * 
     * @since 1.0.0
     */
    const handleLogout = () => {
        sessionStorage.clear()
        setIsUserLoggedIn( false )
    }

    return <>
        <Overlay />
        <header className='site-header'>
            <div className='container'>
                <div className='row'>
                    <div className='site-logo'>
                        <h2 className='site-branding'><Link to="/">{ 'Shop swiftly' }</Link></h2>
                    </div>
                    <nav className='site-menu'>
                        {
                            getPages && getPages.map(( current, index ) => {
                                const { page_id } = current
                                let _thisClass = 'nav-item' + ( index === 0 ? ' active' : '' )
                                return( <span className={ _thisClass } key={ index }><Link to="/page" state={{ ID: page_id }}>{ current['page_title'] }</Link></span> );
                            })
                        }
                    </nav>
                    <div className='site-actions'>
                        <HEADERCONTEXT.Provider value={ headerContext }>
                            <SearchBox />
                            <ThemeMode />
                            <ShoppingCart />
                            { 
                                isUserLoggedIn ? 
                                <div className="user-login-wrapper" onClick={ handleUserClick }>
                                    <div className='user-wrapper'>
                                        <span className='user-name'>{ 'Hello, ' + userName }</span>
                                        <FontAwesomeIcon icon={ isUserDropdownActive ? faAngleUp : faAngleDown } className='dropdown'/>
                                    </div>
                                    { isUserDropdownActive && <div className='user-dropdown-wrapper'>
                                        <button className='admin-dashboard'><Link to={ dashbaordLInk }>{ 'Dashboard' }</Link></button>
                                        <button className='logout' onClick={ handleLogout }>{ 'Logout' }</button>
                                    </div> }
                                </div> :
                                <UserLogin />
                            }
                        </HEADERCONTEXT.Provider>
                    </div>
                </div>
            </div>
        </header>
    </>
}

const SearchBox = () => {
    const [ search, setSearch ] = useState( '' )
    const navigate = useNavigate()

    /**
     * Handle submit
     * 
     * @since 1.0.0
     */
    const handleSubmit = ( event ) => {
        if( search === '' ) {
            event.preventDefault()
            return
        }
        navigate( '/search', { state: { search } } )
    }

    /**
     * Handle change
     * 
     * @since 1.0.0
     */
    const handleChange = ( event ) => {
        let value = event.target.value
        setSearch( value )
    }

    return(
        <div className='search-box-wrapper'>
            <form className='header-search-form' onSubmit={ handleSubmit }>
                <input type="search" placeholder="Search..." className='header-search-input' onChange={ handleChange }/>
                <button className='header-search-button'><FontAwesomeIcon icon={ faMagnifyingGlass } className='site-action site-search'/></button>
            </form>
        </div>
    )
}

const ThemeMode = () => {
    const context = useContext( HEADERCONTEXT )
    const { isLightMode, setIsLightMode } = context

    /* Handle dark mode */
    const handleDarkMode = () => {
        setIsLightMode( ! isLightMode )
        let root = document.getElementById('root')
        if( root.classList.contains( 'is-dark' ) ) {
            root.classList.remove( 'is-dark' )
        } else {
            root.classList.add( 'is-dark' )
        }
    }

    return(
        <div className='theme-mode-wrapper'>
            <FontAwesomeIcon icon={ isLightMode ? faSun : faMoon } className='site-action site-theme-mode' onClick={ handleDarkMode }/>
        </div>
    )
}

const ShoppingCart = () => {
    const homeContext = useContext( HOMECONTEXT )
    const { setOverlay, overlay, setCartActive, cartActive } = homeContext
    const { loggedIn, products } = useSession()
    const [ productQuantity, setProductQuantity ] = useState( 1 )

    /**
     * Handle Shopping cart click
     * 
     * @since 1.0.0
     */
    const handleClick = () => {
        setCartActive( ! cartActive )
        setOverlay( ! overlay )
    }

    /**
     * Handle quantity decrease
     * 
     * @since 1.0.0
     */
    const handleQuantityDecrese = () => {
        if( productQuantity > 1 ) setProductQuantity( productQuantity - 1 )
    }

    /**
     * Handle quantity increase
     * 
     * @since 1.0.0
     */
    const handleQuantityIncrease = () => {
        setProductQuantity( productQuantity + 1 )
    }

    return(
        <div className='shopping-cart-wrapper'>
            <FontAwesomeIcon icon={ faCartShopping } className='site-action site-user' onClick={ handleClick }/>
            { cartActive && <div className='cart-popup-wrapper'>
                {
                    loggedIn ? <>
                        { products.map(( product, index ) => {
                            const { post_title: title, post_price: price, post_image: image } = product
                            return(
                                <div className='item' key={ index }>
                                    <figure className='post-thumb-wrapper no-post-thumb'>
                                        <img src={ image } alt={ title } />
                                    </figure>
                                    <div className='post-elements'>
                                        <h2 className='post-title'>{ title }</h2>
                                        <span className='post-price'>{ 'Rs. ' + price }</span>
                                        <div className='quantity-wrapper'>
                                            <button className='quantity-button decrease' onClick={ handleQuantityDecrese }><FontAwesomeIcon icon={ faMinus }/></button>
                                            <span className='quantity-indicator'>{ productQuantity }</span>
                                            <button className='quantity-button increase' onClick={ handleQuantityIncrease }><FontAwesomeIcon icon={ faPlus }/></button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <Payment 
                            products = { products }
                            productQuantity = { productQuantity }
                        />
                    </> : <div className='not-logged-in'>
                        <span className='message'>{ 'Sorry, you have not logged in.' }</span>
                    </div>
                }
            </div> }
        </div>
    )
}

const UserLogin = () => {
    const context = useContext( HEADERCONTEXT )
    const { isSignInActive, setIsSignInActive } = context
    return(
        <div className='login-form-wrapper'>
            <button className='user-sign-in' onClick={() => setIsSignInActive( ! isSignInActive )}>{ 'Sign in' }</button>
            { isSignInActive && <SignIn setIsSignInActive={ setIsSignInActive } /> }
        </div>
    )
}

/**
 * Handle payment
 * 
 * @since 1.0.0
 */
export const Payment = ( props ) => {
    const { products, productQuantity } = props
    const [ amount, setAmount ] = useState( 0 )
    const taxAmount = 10
    const linkEsewa = false
    const { userId, parsedProductDetails } = useSession()
    const navigate = useNavigate()
    
    /**
     * Handle checkout
     * 
     * @since 1.0.0
     */
    const handleCheckout = ( event ) => {
        let newAmount = 0
        products.map(( product ) => {
            const { post_price } = product
            newAmount += parseInt( post_price )
        })
        setAmount( newAmount )
        if( ! linkEsewa ) {
            const FORMDATA = new FormData()
            FORMDATA.append( 'action', 'insert' )
            FORMDATA.append( 'post_type', 'order' )
            FORMDATA.append( 'table_identity', 'order' )
            FORMDATA.append( 'order_date', Date.now() )
            FORMDATA.append( 'product_id', parsedProductDetails.toString() )
            FORMDATA.append( 'user_id', userId )
            FORMDATA.append( 'order_price', newAmount )
            FORMDATA.append( 'order_status', 'pending' )
            FORMDATA.append( 'order_quantity', productQuantity )
            fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', {
                method: 'POST',
                body: FORMDATA
            })
            .then(( result ) => result.json())
            .then(( data ) => {
                if( data.length > 0 ) {
                    sessionStorage.setItem( 'productDetails', JSON.stringify([]) )
                    navigate('/')
                }
            })
            event.preventDefault()
        }
    }

    /**
     * eSewa ID: 9806800001/2/3/4/5
     * Password: Nepal@123
     * MPIN: 1122 (for application only)
     * Token:123456
     */
    return ( products.length > 0 ) ? <form action="https://uat.esewa.com.np/epay/main" method="POST">
        <input value={ amount + taxAmount } name="tAmt" type="hidden" />
        <input value={ amount } name="amt" type="hidden" />
        <input value={ taxAmount } name="txAmt" type="hidden" />
        <input value="0" name="psc" type="hidden" />
        <input value="0" name="pdc" type="hidden" />
        <input value="EPAYTEST" name="scd" type="hidden" />
        <input value={ Math.floor( Math.random() * 100000 ) } name="pid" type="hidden" />
        <input value="http://localhost:3000" type="hidden" name="su" />
        <input value="http://localhost:3000" type="hidden" name="fu" />
        <input className="checkout-button" value="Checkout" type="submit" onClick={ handleCheckout }/>
    </form> : <div className='no-products'>{ 'No products in cart yet.' }</div>
}

/**
 * Overlay
 * 
 * @since 1.0.0
 */
const Overlay = () => {
    const homeContext = useContext( HOMECONTEXT )
    const { setOverlay, overlay, setCartActive, compareActive, setCompareActive } = homeContext
    const CLASS = 'full-page-overlay' + ( overlay ? ' active' : '' ) 
    /**
     * Handle overlay click
     * 
     * @since 1.0.0
     */
    const handleClick = () => {
        setOverlay( false )
        setCartActive( false )
        setCompareActive( false )
    }
    return <div className={ CLASS } onClick={ handleClick }></div>
}