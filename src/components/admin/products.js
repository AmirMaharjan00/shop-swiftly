import React, { useState, useEffect } from 'react'
import Editor from './editor'

export default function Products ( { editorAddNew } ) {
    const [ editorIsActive, setEditorIsActive ] = useState( false )
    const [ getProducts, setProducts ] = useState([]);

    useEffect(() => {
        if( getProducts.length <= 0 ) setProducts([])
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php?swt_posts=get_table_data' )
        .then(( result ) => result.json())
        .then( ( data ) => { setProducts( (data == null) ? [] : data ) } )
    }, [])

    let statusItems = [
        {'label': 'all'},
        {'label': 'published'},
        {'label': 'draft'},
        {'label': 'trash'}
    ]
    
    // handle add new button click
    const handleAddNewClick = ( event ) => {
        setEditorIsActive( editorIsActive ? false : true )
        editorAddNew()
    }

    const editorSetState = ( newData ) => {
        setProducts( newData )
    }

    let currentTime = new Date().toLocaleString()
    return (
        <>
            <div className='swt-admin-pages admin-products'>
                <button className='product-add' onClick={ handleAddNewClick }>Add New</button>
                <div className='status-time-wrap'>
                    <div className='page-head'>
                        <h2 className='page-title'>Products Management</h2>
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
                            <th className='head-item'>Stock</th>
                            <th className='head-item'>Price</th>
                            <th className='head-item'>Category</th>
                            <th className='head-item'>Tag</th>
                            <th className='head-item'>Date</th>
                            <th className='head-item'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            ( getProducts ) ? getProducts.map(( current, index ) => {
                                    return(
                                        <tr className='products-element products-table-body' key={ index }>
                                            <td className='body-item'>{ index + 1 }</td>
                                            <td className='body-item'>{ current['post_title'] }</td>
                                            <td className='body-item'>{ current['post_stock'] }</td>
                                            <td className='body-item'>{ 'Rs ' + current['post_price'] }</td>
                                            <td className='body-item'>{ current['post_category'] }</td>
                                            <td className='body-item'>{ current['post_tags'] }</td>
                                            <td className='body-item'>{ current['post_date'] }</td>
                                            <td className='body-item'>:</td>
                                        </tr>
                                    ); 
                                })
                            : <tr className='products-element products-table-body no-products'><td className='body-item' colSpan={8}>No Products</td></tr> 
                        }
                    </tbody>
                </table>
            </div>
            { editorIsActive && <Editor 
                prefix = 'post'
                editorClose = { handleAddNewClick }
                taxonomy = { true }
                newData = { editorSetState }
            /> }
        </>
    );
}