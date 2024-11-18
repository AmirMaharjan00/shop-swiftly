import React, { useState, useEffect } from 'react'
import Editor from './editor'
import { PostTypeDeletionPopup } from './functions'
import { usePostRelatedHooks } from '../content/inc/hooks'

export default function Pages () {
    const [ editorIsActive, setEditorIsActive ] = useState( false )
    const [ getPages, setPages ] = useState([]);
    const [ tempPages, setTempPages ] = useState([]);
    const [ editorAction, setEditorAction ] = useState( 'close' )
    const [ deleteAction, setDeleteAction ] = useState( false )
    const [ currentPage, setCurrentPage ] = useState( null )
    const [ status, setStatus ] = useState( 'published' )
    const [ postId, setPostId ] = useState( null )
    const { getTheDate } = usePostRelatedHooks()

    useEffect(() => {
        if( getPages.length <= 0 ) setPages( '' )
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
        if( getPages.length > 0 ) {
            setTemporaryProducts()
        }
    }, [ getPages, status ])

    /**
     * set temporary products
     * 
     * @since 1.0.0
     */
    const setTemporaryProducts = () => {
        let filteredPages = []
        if( status !== 'all' ) {
            let _thisStatus = ( status === 'published' ) ? 'publish' : status
            filteredPages = getPages.filter(( current ) => {
                return current.page_status === _thisStatus
            })
        } else {
            filteredPages = getPages
        }
        setTempPages( filteredPages )
    }

    let statusItems = [
        {'label': 'all'},
        {'label': 'published'},
        {'label': 'draft'},
        {'label': 'trash'}
    ]

    /**
     * Filter the searched products and set the products to state
     * 
     * @since 1.0.0
     * @package Shop Swiftly
     */
    const updateProductsWithSearch = ( searchKey ) => {
        if( searchKey === '' ) {
            setTemporaryProducts()
            return
        }
        let productTitles = tempPages.filter( current => { return current.page_title.toLowerCase().includes( searchKey.toLowerCase() ) } )
        setTempPages( productTitles )
    }

    /**
     * Set multiple states upon trash button click
     * 
     * @since 1.0.0
     */
    const handleTrashButtonClick = ( post, index ) => {
        setDeleteAction( true )
        setCurrentPage( index )
        setPostId( post )
    }

    /**
     * Handle editor Actions
     * 
     * @since 1.0.0
     */
    const handleEditorActions = ( action, pageId ) => {
        setEditorAction( action )
        setEditorIsActive( ! editorIsActive )
        if( action === 'update' ) setPostId( pageId )
    }

    /**
     * No pages found jsx
     * 
     * @since 1.0.0
     */
    const noPagesFound = () => {
        return <tr className='products-element products-table-body no-products'><td className='body-item' colSpan={8}>No Pages</td></tr> 
    }

    let currentTime = new Date().toLocaleString()
    return (
        <>
            <div className='swt-admin-pages admin-products'>
                <button className='product-add' onClick={() => handleEditorActions( 'insert' ) }>Add New</button>
                <div className='status-time-wrap'>
                    <div className='page-head'>
                        <h2 className='page-title'>Pages Management</h2>
                        <span>{ currentTime }</span>
                    </div>
                    <div className='date-search-wrap'>
                        <nav className='status-list'>
                            {
                                statusItems.map(( element, index ) => { 
                                    const { label } = element
                                    var _thisClass = 'status-item'
                                    if( label == status ) _thisClass += ' active';
                                    return <span key={ index } className={ _thisClass } onClick={() => setStatus( label )}>{ label.charAt(0).toUpperCase() + label.slice(1) }</span>
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
                            { status === 'all' && <th className='head-item'>Status</th> }
                            <th className='head-item'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            ( tempPages.length > 0 ) ? tempPages.map(( current, index ) => {
                                    const { page_id: ID, page_title: pageTitle, page_date: pageDate, page_status: pageStatus } = current
                                    const THISSTATUS = ( pageStatus === 'publish' ) ? 'published' : pageStatus
                                    return(
                                        <tr className='products-element products-table-body' key={ index }>
                                            <td className='body-item'>{ index + 1 }</td>
                                            <td className='body-item'>{ pageTitle }</td>
                                            <td className='body-item'>{ getTheDate( pageDate ) }</td>
                                            { status === 'all' && <th className='body-item'>{ THISSTATUS.charAt(0).toUpperCase() + THISSTATUS.slice(1) }</th> }
                                            <td className='body-item action-item'>
                                                <div className='actions-wrapper'>
                                                    <button className='action edit' onClick={() => handleEditorActions( 'update', ID ) }>{ 'Edit' }</button>
                                                    <button className='action trash' onClick={() => handleTrashButtonClick( ID, index ) }>{ 'Trash' }</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ); 
                                })
                            : noPagesFound()
                        }
                    </tbody>
                </table>
            </div>
            { editorIsActive && <Editor 
                prefix = 'page'
                editorClose = { setEditorIsActive }
                updateNewData = { setPages }
                action = { editorAction }
                post = { postId }
            /> }
            {
                deleteAction && <PostTypeDeletionPopup 
                    postType = 'page' 
                    setDeleteAction = { setDeleteAction }
                    setMainState = { setPages }
                    post = { postId }
                    postDetails = { tempPages[currentPage] }
                />
            }
        </>
    );
}