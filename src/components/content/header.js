import React, { useState, useEffect, useContext, createContext } from 'react'
import './assets/css/main.css'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faSun, faMoon, faCartShopping, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { SignIn } from './inc/helpers';
import { fetchFunction } from './functions'

const HEADERCONTEXT = createContext( null )

export default function Header() {
    const [ getPages, setPages ] = useState([]);
    const [ isLightMode, setIsLightMode ] = useState( true )
    const [ isShoppingCartActive, setIsShoppingCartActive ] = useState( false )
    const [ isSignInActive, setIsSignInActive ] = useState( false )
    const [ userDetails, setUserDetails ] = useState({})
    const [ isUserLoggedIn, setIsUserLoggedIn ] = useState( false )
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
                                isUserLoggedIn ? <div className="user-login-wrapper">
                                    { 'Hello, ' + userName }
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
    return(
        <div className='search-box-wrapper'>
            <form className='header-search-form'>
                <input type="search" placeholder="Search..." className='header-search-input'/>
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

const ShoppingCart = ({ isShoppingCartActive, setIsShoppingCartActive }) => {
    const GLOBAL = useContext( HEADERCONTEXT )
    const { isSignInActive, setIsSignInActive, isUserLoggedIn } = GLOBAL
    const cartArray = [ 1, 2, 3, 4, 5 ]
    return(
        <div className='shopping-cart-wrapper'>
            <FontAwesomeIcon icon={ faCartShopping } className='site-action site-user' onClick={() => setIsShoppingCartActive( ! isShoppingCartActive ) }/>
            { isShoppingCartActive && <div className='cart-popup-wrapper'>
                { 
                    isUserLoggedIn ? <>
                        { cartArray.map(( current, index ) => {
                            return(
                                <div className='item' key={ index }>
                                    <figure className='post-thumb-wrapper no-post-thumb'>
                                        <img src="" alt=""/>
                                    </figure>
                                    <div className='post-elements'>
                                        <h2 className='post-title'>{ 'Amir Maharjan' }</h2>
                                        <span className='post-price'>{ 'Rs. 100' }</span>
                                        <div className='quantity-wrapper'>
                                            <button className='quantity-button decrease'><FontAwesomeIcon icon={ faMinus }/></button>
                                            <span className='quantity-indicator'>{ current }</span>
                                            <button className='quantity-button increase'><FontAwesomeIcon icon={ faPlus }/></button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <button className='checkout-button'>{ 'Checkout' }</button>
                    </> : <div className='not-logged-in'>
                        <span className='message'>{ 'Sorry, you have not logged in.' }</span>
                        {/* <UserLogin isSignInActive={ isSignInActive } setIsSignInActive={ setIsSignInActive }/> */}
                        {/* <button className='checkout-button' onClick={() => setIsSignInActive( true )}>{ 'Sign in' }</button> */}
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
        <div className='user-login-wrapper'>
            <button className='user-sign-in' onClick={() => setIsSignInActive( ! isSignInActive )}>{ 'Sign in' }</button>
            { isSignInActive && <SignIn setIsSignInActive={ setIsSignInActive } /> }
        </div>
    )
}