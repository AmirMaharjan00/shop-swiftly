import React, { useState, useEffect } from 'react'
import Editor from './editor'
import { PostTypeDeletionPopup } from './functions'
import { usePostRelatedHooks } from '../content/inc/hooks'

export default function Products () {
    const [ editorIsActive, setEditorIsActive ] = useState( false )
    const [ getProducts, setProducts ] = useState([]);
    const [ tempProducts, setTempProducts ] = useState([]);
    const [ editorAction, setEditorAction ] = useState( 'insert' )
    const [ status, setStatus ] = useState( 'published' )
    const [ postId, setPostId ] = useState( null )
    const [ deleteAction, setDeleteAction ] = useState( false )
    const [ currentIndex, setCurrentIndex ] = useState( null )
    const { getTheDate, getCategory, getTag } = usePostRelatedHooks()

    useEffect(() => {
        if( getProducts.length <= 0 ) setProducts([])
        const FORMDATA = new FormData()
        FORMDATA.append( 'action', 'select' )
        FORMDATA.append( 'table_identity', 'post' )
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', {
            method: 'POST',
            body: FORMDATA 
        })
        .then(( result ) => result.json() )
        .then( ( data ) => setProducts( (data === null) ? [] : data ))
    }, [])

    useEffect(() => {
        if( getProducts.length > 0 ) {
            setTemporaryProducts()
        }
    }, [ getProducts, status ])

    /**
     * set temporary products
     * 
     * @since 1.0.0
     */
    const setTemporaryProducts = () => {
        let filteredPages = []
        if( status !== 'all' ) {
            let _thisStatus = ( status === 'published' ) ? 'publish' : status
            filteredPages = getProducts.filter(( current ) => {
                return current.post_status === _thisStatus
            })
        } else {
            filteredPages = getProducts
        }
        setTempProducts( filteredPages )
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
        let productTitles = tempProducts.filter( current => { return current.post_title.toLowerCase().includes( searchKey.toLowerCase() ) } )
        setTempProducts( productTitles )
    }

    /**
     * Set multiple states upon trash button click
     * 
     * @since 1.0.0
     */
    const handleTrashButtonClick = ( post, index ) => {
        setDeleteAction( true )
        setPostId( post )
        setCurrentIndex( index )
    }

    /**
     * Handle editor Actions
     * 
     * @since 1.0.0
     */
    const handleEditorActions = ( action, postId ) => {
        setEditorAction( action )
        setEditorIsActive( ! editorIsActive )
        setPostId( ( action === 'insert' ) ? '' : postId )}

    let currentTime = new Date().toLocaleString()
    return (
        <>
            { editorIsActive && <Editor 
                prefix = 'post'
                editorClose = { setEditorIsActive }
                updateNewData = { setProducts }
                action = { editorAction }
                post = { postId }
            /> }
            <div className='swt-admin-pages admin-products'>
                <button className='product-add' onClick={() => handleEditorActions( 'insert' ) }>Add New</button>
                <div className='status-time-wrap'>
                    <div className='page-head'>
                        <h2 className='page-title'>Products Management</h2>
                        <span>{ currentTime }</span>
                    </div>
                    <div className='date-search-wrap'>
                        <nav className='status-list'>
                            {
                                statusItems.map(( element, index ) => { 
                                    const { label } = element
                                    var _thisClass = 'status-item'
                                    if( label === status ) _thisClass += ' active'
                                    return <span 
                                        key={ index }
                                        className={ _thisClass }
                                        onClick={() => setStatus( label ) }
                                    >
                                        { label.charAt(0).toUpperCase() + label.slice(1) }
                                    </span>
                                })
                            }  
                        </nav>
                        <label>
                            <input type='search' placeholder='Search . . .' onChange={( event ) => updateProductsWithSearch( event.target.value )} />
                            <input type='submit' value='Search'/>
                        </label>
                    </div>
                </div>
                <table className='products-wrap'>
                    <thead>
                        <tr className='products-element products-table-head'>
                            <th className='head-item'>{ 'Sno' }</th>
                            <th className='head-item title'>{ 'Title' }</th>
                            <th className='head-item'>{ 'Stock' }</th>
                            <th className='head-item'>{ 'Price' }</th>
                            <th className='head-item'>{ 'Category' }</th>
                            <th className='head-item'>{ 'Tag' }</th>
                            <th className='head-item'>{ 'Date' }</th>
                            { status === 'all' && <th className='head-item'>{ 'Status' }</th> }
                            <th className='head-item'>{ 'Action' }</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            ( tempProducts.length > 0 ) ? tempProducts.map(( current, index ) => {
                                const { post_id: ID, post_title: title, post_stock: stock, post_price: price, post_category: category, post_tags: tags, post_date: date, post_status: postStatus } = current
                                const THISSTATUS = ( postStatus === 'publish' ) ? 'published' : postStatus
                                    return(
                                        <tr className='products-element products-table-body' key={ index }>
                                            <td className='body-item'>{ index + 1 }</td>
                                            <td className='body-item title' onClick={() => handleEditorActions( 'update', ID ) }>
                                                <span class="post-title">{ title }</span>
                                            </td>
                                            <td className='body-item'>{ stock }</td>
                                            <td className='body-item'>{ 'Rs ' + price }</td>
                                            <td className='body-item'>{( getCategory( category ).length > 0 ? getCategory( category ) : '-' )}</td>
                                            <td className='body-item'>{( getTag( tags ).length > 0 ? getTag( tags ) : '-' )}</td>
                                            <td className='body-item'>{ getTheDate( date ) || '-' }</td>
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
                            : <tr className='products-element products-table-body no-products'><td className='body-item' colSpan={8}>No Products</td></tr> 
                        }
                    </tbody>
                </table>
            </div>
            {
                deleteAction && <PostTypeDeletionPopup 
                    postType = 'post' 
                    setDeleteAction = { setDeleteAction }
                    post = { postId }
                    setMainState = { setProducts }
                    postDetails = { tempProducts[currentIndex] }
                />
            }
        </>
    );
}