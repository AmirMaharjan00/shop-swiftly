import React, { useState } from 'react'
import { json } from 'react-router-dom'
import Taxonomy from './taxonomy'

export default function Editor( { prefix, editorClose, newData } ) {
    const [ formInfo, setFormInfo ] = useState({})
    const [ activeSidebarElement, setActiveSidebarElement ] = useState( 'category' )
    const [ checkedCategory, setCheckedCategory ] = useState([])
    const [ checkedTag, setCheckedTag ] = useState([])
    const [ title, setTitle ] = useState( '' )
    const [ excerpt, setExcerpt ] = useState( '' )

    // handle form submit
    const handleFormSubmit = ( event ) => {
        event.preventDefault()
        var postsParams = {
            'post_category' : checkedCategory.join(','),
            'post_tags' : checkedTag.join(','),
            'post_stock' : 0,
            'post_price' : 0
        }
        var bodyParams = {}
        bodyParams = { 
            [ prefix + '_title' ]: title,
            [ prefix + '_excerpt' ]: excerpt,
            [ prefix + '_image' ]: '',
            [ prefix + '_date' ]: Date.now(),
            ...formInfo
        }
        if( prefix == 'post' ) bodyParams = { ...postsParams, ...bodyParams }
        var apiParameters = {
            method: 'POST',
            body: JSON.stringify({
                'params' : bodyParams,
                'post_type' : prefix
            })
        }
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', apiParameters )
        .then(( result ) => result.json())
        .then( ( data ) => { updateRespectiveStates( data ) } )
        let formValues = {
            'post_title' : title,
            'post_excerpt' : excerpt,
            'category' : checkedCategory,
            'tag' : checkedTag,
        }
        setFormInfo( formValues )
        editorClose()
    }

    const updateRespectiveStates = ( data ) => {
        newData( data )
        setFormInfo( data )
    }
    
    // handle sidebar element click
    const handleSidebarElementClick = ( element ) => {
        setActiveSidebarElement( element )
    }

    // handle category checkbox change
    const handleCategoryCheckboxChange = ( checked ) => {
        setCheckedCategory( checked )
    }

    // handle tags checkbox change
    const handleTagCheckboxChange = ( checked ) => {
        setCheckedTag( checked )
    }

    return (
        <>
            <div className='swt-admin-editor' id='swt-admin-editor'>
                <div className='editor-inner'>
                    <span className='editor-close' onClick={ () => { editorClose() } }>X</span>
                    <form onSubmit={ handleFormSubmit } >
                        <div className='editor-area'>
                            <div className='editor-main'>
                                <input type='text' placeholder='Title' name={ prefix + '_title' } id={ prefix + '_title' } onChange={( event ) => setTitle( event.target.value ) } />
                                <textarea placeholder='Description' name={ prefix + '_excerpt' } id={ prefix + '_excerpt' } rows='15' onChange={( event ) => setExcerpt( event.target.value ) }></textarea>
                            </div>
                            <div className='editor-sidebar'>
                                <button className='editor-submit'>Publish</button>
                                <div className='sidebar-elements-wrap'>
                                    { prefix == 'post' && <Taxonomy
                                        handleCheckbox = { handleCategoryCheckboxChange }
                                        placeholder = 'Add New Category'
                                        buttonLabel = 'Add Category'
                                        activeClass = { activeSidebarElement === 'category' }
                                        updateActiveClass = { handleSidebarElementClick }
                                    /> }
                                    { prefix == 'post' && <Taxonomy
                                        handleCheckbox = { handleTagCheckboxChange }
                                        placeholder = 'Add New Tag'
                                        buttonLabel = 'Add Tag'
                                        label = 'Tag'
                                        type = 'tag'
                                        activeClass = { activeSidebarElement === 'tag' }
                                        updateActiveClass = { handleSidebarElementClick }
                                    /> }
                                    <div className={'sidebar-element featured-image' + ( activeSidebarElement === 'featured-image' ? ' isactive': '' )} onClick={ () => ( handleSidebarElementClick( 'featured-image' ) ) }>Featured Image</div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}