import React, { useState, useEffect } from 'react'
import Editor from './editor'

export default function Pages ( { editorAddNew } ) {
    const [ editorIsActive, setEditorIsActive ] = useState( false )
    const [ getPages, setPages ] = useState([]);

    useEffect(() => {
        if( getPages.length <= 0 ) setPages( '' )
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php?swt_pages=get_table_data' )
        .then(( result ) => result.json())
        .then( ( data ) => { setPages( data ) } )
    }, [])

    let statusItems = [
        {'label': 'all'},
        {'label': 'published'},
        {'label': 'draft'},
        {'label': 'trash'}
    ]

    const editorSetState = ( newData ) => {
        setPages( newData )
    }
    
    // handle add new button click
    const handleAddNewClick = ( event ) => {
        setEditorIsActive( editorIsActive ? false : true )
        editorAddNew()
    }

    let currentTime = new Date().toLocaleString()
    return (
        <>
            <div className='swt-admin-pages admin-products'>
                <button className='product-add' onClick={ handleAddNewClick }>Add New</button>
                <div className='status-time-wrap'>
                    <div className='page-head'>
                        <h2 className='page-title'>Pages Management</h2>
                        <span>{ currentTime }</span>
                    </div>
                    <div className='date-search-wrap'>
                        <nav className='status-list'>
                            {
                                statusItems.map(( element, index ) => { 
                                    var _thisClass = 'status-item'
                                    if( index == 0 ) _thisClass += ' active';
                                    return <span key={ index } className={ _thisClass }>{ element.label.charAt(0).toUpperCase() + element.label.slice(1) }</span>
                                })
                            }  
                        </nav>
                        <label>
                            <input type='search' placeholder='Search . . .'/>
                            <input type='submit' value='Search'/>
                        </label>
                    </div>
                </div>
                <table className='products-wrap'>
                    <thead>
                        <tr className='products-element products-table-head'>
                            <th className='head-item'>Sno</th>
                            <th className='head-item'>Title</th>
                            <th className='head-item'>Date</th>
                            <th className='head-item'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            ( getPages ) ? getPages.map(( current, index ) => {
                                    return(
                                        <tr className='products-element products-table-body' key={ index }>
                                            <td className='body-item'>{ index + 1 }</td>
                                            <td className='body-item'>{ current['page_title'] }</td>
                                            <td className='body-item'>{ current['page_date'] }</td>
                                            <td className='body-item'>:</td>
                                        </tr>
                                    ); 
                                })
                            : <tr className='products-element products-table-body no-products'><td className='body-item' colSpan={8}>No Pages</td></tr> 
                        }
                    </tbody>
                </table>
            </div>
            { editorIsActive && <Editor 
                prefix = 'page'
                editorClose = { handleAddNewClick }
                taxonomy = { false }
                newData = { editorSetState }
            /> }
        </>
    );
}