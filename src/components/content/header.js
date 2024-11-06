import React, { useState, useEffect, useContext, createContext, useMemo } from 'react'
import './assets/css/main.css'
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faSun, faMoon, faCartShopping, faPlus, faMinus, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { SignIn } from './inc/helpers';
import { fetchFunction } from './functions'
import { useSession } from './inc/hooks'

const HEADERCONTEXT = createContext( null )

export default function Header() {
    const [ getPages, setPages ] = useState([]);
    const [ isLightMode, setIsLightMode ] = useState( true )
    const [ isShoppingCartActive, setIsShoppingCartActive ] = useState( false )
    const [ isSignInActive, setIsSignInActive ] = useState( false )
    const [ userDetails, setUserDetails ] = useState({})
    const [ isUserLoggedIn, setIsUserLoggedIn ] = useState( false )
    const [ isUserDropdownActive, setIsUserDropdownActive ] = useState( false )
    const { user_name: userName } = userDetails

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

    return (
        <header className='site-header'>
            <div className='container'>
                <div className='row'>
                    <div className='site-logo'>
                        <h2 className='site-branding'><Link to="/">{ 'Shop swiftly' }</Link></h2>
                    </div>
                    <nav className='site-menu'>
                        {
                            getPages && getPages.map(( current, index ) => {
                                let _thisClass = 'nav-item' + ( index === 0 ? ' active' : '' )
                                return( <span className={ _thisClass } key={ index }><Link>{ current['page_title'] }</Link></span> );
                            })
                        }
                    </nav>
                    <div className='site-actions'>
                        <HEADERCONTEXT.Provider value={{ isSignInActive: isSignInActive, setIsSignInActive:{ setIsSignInActive }, isUserLoggedIn: isUserLoggedIn }}>
                            <SearchBox />
                            <ThemeMode isLightMode={ isLightMode } setIsLightMode={ setIsLightMode }/>
                            <ShoppingCart isShoppingCartActive={ isShoppingCartActive } setIsShoppingCartActive={ setIsShoppingCartActive }/>
                            { 
                                isUserLoggedIn ? 
                                <div className="user-login-wrapper" onClick={ handleUserClick }>
                                    <div className='user-wrapper'>
                                        <span className='user-name'>{ 'Hello, ' + userName }</span>
                                        <FontAwesomeIcon icon={ isUserDropdownActive ? faAngleUp : faAngleDown } className='dropdown'/>
                                    </div>
                                    { isUserDropdownActive && <div className='user-dropdown-wrapper'>
                                        <button className='admin-dashboard'><Link to="/swt-admin">{ 'Admin Dashboard' }</Link></button>
                                        <button className='logout' onClick={ handleLogout }>{ 'Logout' }</button>
                                    </div> }
                                </div> :
                                <UserLogin isSignInActive={ isSignInActive } setIsSignInActive={ setIsSignInActive }/>
                            }
                        </HEADERCONTEXT.Provider>
                    </div>
                </div>
            </div>
        </header>
    )
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

const ThemeMode = ({ isLightMode, setIsLightMode }) => {
    return(
        <div className='theme-mode-wrapper'>
            <FontAwesomeIcon icon={ isLightMode ? faSun : faMoon } className='site-action site-theme-mode' onClick={() => setIsLightMode( ! isLightMode ) }/>
        </div>
    )
}

const ShoppingCart = () => {
    const [ cartActive, setCartActive ] = useState( false )
    const { loggedIn, products } = useSession()

    /**
     * Handle Shopping cart click
     * 
     * @since 1.0.0
     */
    const handleClick = () => {
        setCartActive( ! cartActive )
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
                                            <button className='quantity-button decrease'><FontAwesomeIcon icon={ faMinus }/></button>
                                            <span className='quantity-indicator'>{ 1 }</span>
                                            <button className='quantity-button increase'><FontAwesomeIcon icon={ faPlus }/></button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <button className='checkout-button'>{ 'Checkout' }</button>
                    </> : <div className='not-logged-in'>
                        <span className='message'>{ 'Sorry, you have not logged in.' }</span>
                    </div>
                }
            </div> }
        </div>
    )
}

const UserLogin = ({ isSignInActive, setIsSignInActive }) => {
// const UserLogin = () => {
    // const GLOBAL = useContext( HEADERCONTEXT )
    // const { isSignInActive, setIsSignInActive, isUserLoggedIn } = GLOBAL
    return(
        <div className='login-form-wrapper'>
            <button className='user-sign-in' onClick={() => setIsSignInActive( ! isSignInActive )}>{ 'Sign in' }</button>
            { isSignInActive && <SignIn setIsSignInActive={ setIsSignInActive } /> }
        </div>
    )
}