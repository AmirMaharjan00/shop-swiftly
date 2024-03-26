import React, { useState, useEffect } from 'react'
import './assets/css/main.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export default function Header() {
    const [ getPages, setPages ] = useState([]);

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
                                return( <span className='nav-item' key={ index }><Link>{ current['page_title'] }</Link></span> );
                            })
                        }
                    </nav>
                    <div className='site-actions'>
                        <button className='action-item'>Search</button>
                        <button className='action-item'>Dark Mode</button>
                        <button className='action-item'>login</button>
                    </div>
                </div>
            </div>
        </header>
    )
}