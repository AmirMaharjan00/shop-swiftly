import React, { useState, useEffect } from 'react'
import './assets/css/main.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faSun, faMoon, faUserTie, faCartShopping, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

export default function Header() {
    const [ getPages, setPages ] = useState([]);
    const [ isSearchActive, setIsSearchActive ] = useState( false )
    const [ isLightMode, setIsLightMode ] = useState( true )
    const [ isLoginPopupActive, setIsLoginPopupActive ] = useState( false )
    const [ isShoppingCartActive, setIsShoppingCartActive ] = useState( false )

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

    return (
        <header className='site-header'>
            <div className='container'>
                <div className='row'>
                    <div className='site-logo'>
                        <h2 className='site-branding'>Shop swiftly</h2>
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
                        <SearchBox isSearchActive={ isSearchActive } setIsSearchActive={ setIsSearchActive }/>
                        <ThemeMode isLightMode={ isLightMode } setIsLightMode={ setIsLightMode }/>
                        <ShoppingCart isShoppingCartActive={ isShoppingCartActive } setIsShoppingCartActive={ setIsShoppingCartActive }/>
                        <UserLogin isLoginPopupActive={ isLoginPopupActive } setIsLoginPopupActive={ setIsLoginPopupActive }/>
                    </div>
                </div>
            </div>
        </header>
    )
}

const SearchBox = ({ isSearchActive, setIsSearchActive }) => {
    return(
        <div className='search-box-wrapper'>
            <FontAwesomeIcon icon={ faMagnifyingGlass } className='site-action site-search' onClick={() => setIsSearchActive( ! isSearchActive ) }/>
            { isSearchActive && <form onSubmit="" className='header-search-form'>
                <input type="search" placeholder="Search..." />
            </form> }
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
    const cartArray = [ 1, 2, 3, 4, 5 ]
    return(
        <div className='shopping-cart-wrapper'>
            <FontAwesomeIcon icon={ faCartShopping } className='site-action site-user' onClick={() => setIsShoppingCartActive( ! isShoppingCartActive ) }/>
            { isShoppingCartActive && <div className='cart-popup-wrapper'>
                {
                    cartArray.map(( current ) => {
                        return(
                            <div className='item'>
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
                    })
                }
                <button className='checkout-button'>{ 'Checkout' }</button>
            </div> }
        </div>
    )
}

const UserLogin = ({ isLoginPopupActive, setIsLoginPopupActive }) => {
    return(
        <div className='user-login-wrapper'>
            <FontAwesomeIcon icon={ faUserTie } className='site-action site-user' onClick={() => setIsLoginPopupActive( ! isLoginPopupActive ) }/>
        </div>
    )
}