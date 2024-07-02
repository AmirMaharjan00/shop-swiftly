import React, { useState, useEffect } from 'react'
import './assets/css/main.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faSun, faMoon, faUserTie } from '@fortawesome/free-solid-svg-icons'

export default function Header() {
    const [ getPages, setPages ] = useState([]);
    const [ isSearchActive, setIsSearchActive ] = useState( false )
    const [ isLightMode, setIsLightMode ] = useState( true )
    const [ isLoginPopupActive, setIsLoginPopupActive ] = useState( false )

    useEffect(() => {
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php?swt_pages=get_table_data' )
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
                        <FontAwesomeIcon icon={ faMagnifyingGlass } className='site-action site-search' onClick={() => setIsSearchActive( ! isSearchActive ) }/>
                        { isSearchActive && <form onSubmit="" className='header-search-form'>
                            <input type="search" placeholder="Search..." />
                        </form> }
                        <FontAwesomeIcon icon={ isLightMode ? faSun : faMoon } className='site-action site-theme-mode' onClick={() => setIsLightMode( ! isLightMode ) }/>
                        <FontAwesomeIcon icon={ faUserTie } className='site-action site-user' onClick={() => setIsLoginPopupActive( ! isLoginPopupActive ) }/>
                    </div>
                </div>
            </div>
        </header>
    )
}