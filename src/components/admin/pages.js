import React, { useState, useEffect } from 'react'
import Editor from './editor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

export default function Pages ( { editorAddNew } ) {
    const [ editorIsActive, setEditorIsActive ] = useState( false )
    const [ getPages, setPages ] = useState([]);
    const [ tempPages, setTempPages ] = useState([]);

    useEffect(() => {
        if( getPages.length <= 0 ) setPages( '' )
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php?swt_pages=get_table_data' )
        .then(( result ) => result.json())
        .then( ( data ) => { setPages( data ) } )
    }, [])

    useEffect(() => {
        setTempPages( getPages )
    }, [ getPages ])

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

    /**
     * Filter the searched products and set the products to state
     * 
     * @since 1.0.0
     * @package Shop Swiftly
     */
    const updateProductsWithSearch = ( searchKey ) => {
        if( searchKey == '' ) {
            setTempPages( getPages )
            return
        }
        let productTitles = tempPages.filter( current => { return current.page_title.toLowerCase().includes( searchKey.toLowerCase() ) } )
        setTempPages( productTitles )
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
                            <input type='search' placeholder='Search . . .' onChange={( event ) => updateProductsWithSearch( event.target.value )}/>
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
                            ( tempPages.length > 0 ) ? tempPages.map(( current, index ) => {
                                    return(
                                        <tr className='products-element products-table-body' key={ index }>
                                            <td className='body-item'>{ index + 1 }</td>
                                            <td className='body-item'>{ current['page_title'] }</td>
                                            <td className='body-item'>{ current['page_date'] }</td>
                                            <td className='body-item'><FontAwesomeIcon icon={ faEllipsisVertical } /></td>
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
                newData = { editorSetState }
            /> }
        </>
    );
}