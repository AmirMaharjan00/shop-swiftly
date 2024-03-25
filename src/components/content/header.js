import React, { useState, useEffect } from 'react'
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
            <nav className='site-menu'>
                {
                    getPages && getPages.map(( current, index ) => {
                        return( <span className='nav-item' key={ index }><Link>{ current['page_title'] }</Link></span> );
                    })
                }
            </nav>
        </header>
    )
}