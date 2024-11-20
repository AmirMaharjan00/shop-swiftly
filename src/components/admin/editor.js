import React, { useState, useEffect } from 'react'
import Taxonomy from './taxonomy'
import { MediaCollection } from './media'

export default function Editor( { prefix, editorClose, updateNewData, action, post } ) {
    const [ activeSidebarElement, setActiveSidebarElement ] = useState( 'category' )
    const [ checkedCategory, setCheckedCategory ] = useState('')
    const [ checkedTag, setCheckedTag ] = useState('')
    const [ title, setTitle ] = useState( '' )
    const [ excerpt, setExcerpt ] = useState( '' )
    const [ price, setPrice ] = useState( 0 )
    const [ stock, setStock ] = useState( 0 )
    const [ featured, setFeatured ] = useState( "0" )
    const [ image, setImage ] = useState( '' )
    const [ metaData, setMetaData ] = useState({})
    const [ isImageSelected, setIsImageSelected ] = useState( false )
    const [ isMediaLibraryOpen, setIsMediaLibraryOpen ] = useState( false )

    useEffect(() => {
        if( action === 'update' ) {
            const FORMDATA = new FormData()
            FORMDATA.append( 'action', 'select' )
            FORMDATA.append( 'table_identity', prefix )
            FORMDATA.append( 'post', post )
            fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', {
                method: 'POST',
                body: FORMDATA
            })
            .then(( result ) => result.json())
            .then( ( data ) => { updatePostInfo( data ) } )
        }
    }, [])

    /**
     * Set post info
     * 
     * @since 1.0.0
     */
    const updatePostInfo = ( data ) => {
        if( data.length > 0 ) {
            data.map(( current ) => {
                setTitle( current[ prefix + '_title' ] )
                setExcerpt( current[ prefix + '_excerpt' ] )
                setImage( current[ prefix + '_image' ] )
                if( prefix === 'post' ) {
                    setCheckedCategory( current[ 'post_category' ] )
                    setCheckedTag( current[ 'post_tags' ] )
                    setPrice( current[ 'post_price' ] )
                    setStock( current[ 'post_stock' ] )
                    setFeatured( current[ 'is_featured' ] )
                    setMetaData( current[ 'meta_data' ] )
                }
            })
        }
    }

    /**
     * Handle Form data
     * 
     * @since 1.0.0
     */
    const handleFormData = () => {
        const FORMDATA = new FormData()
        FORMDATA.append( 'action', action )
        FORMDATA.append( 'table_identity', prefix )
        if( action === 'update' ) {
            FORMDATA.append( 'post', post )
        } else {
            FORMDATA.append( prefix + '_date', Date.now() )
        }
        FORMDATA.append( prefix + '_title', title )
        FORMDATA.append( prefix + '_excerpt', excerpt )
        FORMDATA.append( prefix + '_image', image )
        FORMDATA.append( prefix + '_status', 'publish' )
        FORMDATA.append( 'post_type', prefix )
        if( prefix === 'post' ) {
            FORMDATA.append( 'post_category', checkedCategory )
            FORMDATA.append( 'post_tags', checkedTag )
            FORMDATA.append( 'post_stock', stock )
            FORMDATA.append( 'post_price', price )
            FORMDATA.append( 'is_featured', featured )
            FORMDATA.append( 'meta_data', JSON.stringify( metaData ) )
        }
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', {
            method: 'POST',
            body: FORMDATA
        })
        .then(( result ) => result.json())
        .then( ( data ) => { updateNewData( data ) } )
    }

    // handle form submit
    const handleFormSubmit = ( event ) => {
        event.preventDefault()
        handleFormData()
        editorClose()
    }

    /**
     * Handle image select
     * 
     * @since 1.0.0
     */
    const handleImageSelect = ( imagePath ) => {
        setImage( imagePath )
        setIsImageSelected( true )
    }

    return (
        <>
            <div className='editor-overlay'></div>
            <div className='swt-admin-editor' id='swt-admin-editor'>
                <div className='editor-inner'>
                    <span className='editor-close' onClick={ () => { editorClose() } }>X</span>
                    <form onSubmit={ handleFormSubmit } className='editor-popup'>
                        <div className='editor-area'>
                            <div className='editor-main'>
                                <input type='text' placeholder='Title' value={ title } name={ prefix + '_title' } id={ prefix + '_title' } onChange={( event ) => setTitle( event.target.value ) } />
                                <textarea placeholder='Description' value={ excerpt } name={ prefix + '_excerpt' } id={ prefix + '_excerpt' } rows='15' onChange={( event ) => setExcerpt( event.target.value ) }></textarea>
                                <div className='meta-wrapper'>
                                    {( prefix === 'post' ) && <>
                                        <div className='meta price-wrapper'>
                                            <label htmlFor="price">{ 'Price :' }</label>
                                            <input type="number" id="price" value={ price } onChange={( event ) => setPrice( event.target.value )}/>
                                        </div>
                                        <div className='meta stock-wrapper'>
                                            <label htmlFor='stock'>{ 'Stock :' }</label>
                                            <input type="number" id="stock" value={ stock } onChange={( event ) => setStock( event.target.value )}/>
                                        </div>
                                        <div className='meta stock-wrapper featured'>
                                            <label htmlFor='featured'>{ 'Featured :' }</label>
                                            <div className='switch'>
                                                <input type="checkbox" id="featured" checked={ featured === "1" } onChange={( event ) => setFeatured( event.target.checked ? '1' : '0' )}/>
                                                <span className="slider round"></span>
                                            </div>
                                        </div>
                                    </> }
                                </div>
                            </div>
                            <div className='editor-sidebar'>
                                <button className='editor-submit'>Publish</button>
                                <div className='sidebar-elements-wrap'>
                                    { prefix === 'post' && <>
                                        <Taxonomy
                                            taxonomy = { checkedCategory }
                                            handleCheckbox = { setCheckedCategory }
                                            placeholder = 'Add New Category'
                                            buttonLabel = 'Add Category'
                                            activeClass = { activeSidebarElement === 'category' }
                                            updateActiveClass = { setActiveSidebarElement }
                                        /> 
                                        <Taxonomy
                                            taxonomy = { checkedCategory }
                                            handleCheckbox = { setCheckedTag }
                                            placeholder = 'Add New Tag'
                                            buttonLabel = 'Add Tag'
                                            label = 'Tag'
                                            type = 'tag'
                                            activeClass = { activeSidebarElement === 'tag' }
                                            updateActiveClass = { setActiveSidebarElement }
                                        /> 
                                    </> }
                                    <div className={'sidebar-element featured-image' + ( activeSidebarElement === 'featured-image' ? ' isactive': '' )} onClick={ () => ( setActiveSidebarElement( 'featured-image' ) ) }>
                                        <span className='element-head'>{ 'Featured Image' }</span>
                                        <div className='element-body' onClick={() => setIsMediaLibraryOpen( ! isMediaLibraryOpen )}>
                                            { ( isImageSelected || action === 'update' ) && <figure className='post-thumbnail-wrapper'>
                                                <img src={ image } alt="" className='post-thumbnail' />
                                            </figure> }
                                            { isMediaLibraryOpen && 
                                                <div className='editor-media-wrapper'>
                                                    <MediaCollection setImage={ handleImageSelect }/> 
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}