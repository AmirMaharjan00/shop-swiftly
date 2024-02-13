import React, { useState } from 'react'
import Editor from './editor'

export default function Products ( { editorAddNew } ) {
    const [ editorIsActive, setEditorIsActive ] = useState( false )
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

    let currentTime = new Date().toLocaleString()
    return (
        <>
            <div className='swt-admin-pages admin-products'>
                <button className='product-add' onClick={ handleAddNewClick }>Add New</button>
                <div className='page-head'>
                    <h2 className='page-title'>Products Management</h2>
                    <div className='date-search-wrap'>
                        <span>{ currentTime }</span>
                        <label>
                            <input type='search'/>
                            <input type='submit' value='Search'/>
                        </label>
                    </div>
                </div>
                <div className='page-status'>
                    <ul className='status-list'>
                        {
                            statusItems.map(( element, index ) => { 
                                return <li key={ index } className='status-item'>{ element.label.charAt(0).toUpperCase() + element.label.slice(1) }</li>
                            })
                        }  
                    </ul>
                </div>
                <div className='products-wrap'>
                    <ul className='products-element products-table-head'>
                        <li className='head-item'>Sno</li>
                        <li className='head-item'>Title</li>
                        <li className='head-item'>Stock</li>
                        <li className='head-item'>Price</li>
                        <li className='head-item'>Category</li>
                        <li className='head-item'>Tag</li>
                        <li className='head-item'>Date</li>
                        <li className='head-item'>Action</li>
                    </ul>
                    <ul className='products-element products-table-body'>
                        <li className='body-item'>1</li>
                        <li className='body-item'>Title 1</li>
                        <li className='body-item'>100</li>
                        <li className='body-item'>Rs 1000</li>
                        <li className='body-item'>category 1</li>
                        <li className='body-item'>Tag 1</li>
                        <li className='body-item'>2023/10/10</li>
                        <li className='body-item'>:</li>
                    </ul>
                </div>
            </div>
            { editorIsActive && <Editor editorClose={ handleAddNewClick } /> }
        </>
    );
}