import React, { useState, useEffect } from 'react'
import Taxonomy from './taxonomy'
import { MediaCollection } from './media'
import { getImages } from './functions'

export default function Editor( { prefix, editorClose, updateNewData, action } ) {
    const [ activeSidebarElement, setActiveSidebarElement ] = useState( 'category' )
    const [ checkedCategory, setCheckedCategory ] = useState([])
    const [ checkedTag, setCheckedTag ] = useState([])
    const [ title, setTitle ] = useState( '' )
    const [ excerpt, setExcerpt ] = useState( '' )
    const [ price, setPrice ] = useState( 0 )
    const [ stock, setStock ] = useState( 0 )
    const [ imageList, setImageList ] = useState([])
    const [ isMediaLibraryOpen, setIsMediaLibraryOpen ] = useState( false )

    useEffect(() => {
        const images = getImages()
        setImageList( images.keys().map(image => images(image)) )
    }, [])

    // handle form submit
    const handleFormSubmit = ( event ) => {
        event.preventDefault()
        const FORMDATA = new FormData()
        FORMDATA.append( 'action', 'insert' )
        FORMDATA.append( prefix + '_title', title )
        FORMDATA.append( prefix + '_excerpt', excerpt )
        FORMDATA.append( prefix + '_image', '' )
        FORMDATA.append( prefix + '_date', Date.now() )
        FORMDATA.append( prefix + '_status', 'publish' )
        FORMDATA.append( 'post_type', prefix )
        if( prefix === 'post' ) {
            FORMDATA.append( 'post_category', checkedCategory.join(',') )
            FORMDATA.append( 'post_tags', checkedTag.join(',') )
            FORMDATA.append( 'post_stock', stock )
            FORMDATA.append( 'post_price', price )
        }
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', {
            method: 'POST',
            body: FORMDATA
        })
        .then(( result ) => result.json())
        .then( ( data ) => { updateNewData( data ) } )
        editorClose()
    }

    return (
        <>
            <div className='editor-overlay'></div>
            <div className='swt-admin-editor' id='swt-admin-editor'>
                <div className='editor-inner'>
                    <span className='editor-close' onClick={ () => { editorClose() } }>X</span>
                    <form onSubmit={ handleFormSubmit } >
                        <div className='editor-area'>
                            <div className='editor-main'>
                                <input type='text' placeholder='Title' name={ prefix + '_title' } id={ prefix + '_title' } onChange={( event ) => setTitle( event.target.value ) } />
                                <textarea placeholder='Description' name={ prefix + '_excerpt' } id={ prefix + '_excerpt' } rows='15' onChange={( event ) => setExcerpt( event.target.value ) }></textarea>
                                <div className='meta-wrapper'>
                                    { ( prefix === 'post' ) && <p className='meta price-wrapper'>
                                        <label htmlFor="price">{ 'Price :' }</label>
                                        <input type="number" id="price" value={ price } onChange={( event ) => setPrice( event.target.value )}/>
                                    </p> }
                                    { ( prefix === 'post' ) && <p className='meta stock-wrapper'>
                                        <label htmlFor='stock'>{ 'Stock :' }</label>
                                        <input type="number" id="stock" value={ stock } onChange={( event ) => setStock( event.target.value )}/>
                                    </p> }
                                </div>
                            </div>
                            <div className='editor-sidebar'>
                                <button className='editor-submit'>Publish</button>
                                <div className='sidebar-elements-wrap'>
                                    { prefix === 'post' && <Taxonomy
                                        handleCheckbox = { setCheckedCategory }
                                        placeholder = 'Add New Category'
                                        buttonLabel = 'Add Category'
                                        activeClass = { activeSidebarElement === 'category' }
                                        updateActiveClass = { setActiveSidebarElement }
                                    /> }
                                    { prefix === 'post' && <Taxonomy
                                        handleCheckbox = { setCheckedTag }
                                        placeholder = 'Add New Tag'
                                        buttonLabel = 'Add Tag'
                                        label = 'Tag'
                                        type = 'tag'
                                        activeClass = { activeSidebarElement === 'tag' }
                                        updateActiveClass = { setActiveSidebarElement }
                                    /> }
                                    <div className={'sidebar-element featured-image' + ( activeSidebarElement === 'featured-image' ? ' isactive': '' )} onClick={ () => ( setActiveSidebarElement( 'featured-image' ) ) }>
                                        <span className='element-head'>{ 'Featured Image' }</span>
                                        <div className='element-body' onClick={() => setIsMediaLibraryOpen( ! isMediaLibraryOpen )}>
                                                { isMediaLibraryOpen && 
                                                    <div className='editor-media-wrapper'>
                                                        <MediaCollection images={ imageList }/> 
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