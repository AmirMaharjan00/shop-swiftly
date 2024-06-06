import React, { useState } from 'react'
import { json } from 'react-router-dom'

export default function Editor( { prefix, editorClose, taxonomy, newData } ) {
    const [ formInfo, setFormInfo ] = useState({})
    const [ activeSidebarElement, setActiveSidebarElement ] = useState( 'category' )
    const [ categoryList, setCategoryList ] = useState([{ label: 'uncategorized', slug: 'uncategorized' }])
    const [ categoryItem, setCategoryItem ] = useState({ label: '', slug: '' })
    const [ checkedCategory, setCheckedCategory ] = useState([])
    const [ tagList, setTagList ] = useState([])
    const [ tagItem, setTagItem ] = useState({ label: '', slug: '' })
    const [ checkedTag, setCheckedTag ] = useState([])

    // handle form submit
    const handleFormSubmit = ( event ) => {
        event.preventDefault()
        var postsParams = {
            'post_category' : '',
            'post_tags' : '',
            'post_stock' : 0,
            'post_price' : 0
        }
        var bodyParams = {}
        bodyParams = { 
            [ prefix + '_title' ]: '',
            [ prefix + '_excerpt' ]: '',
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
        setFormInfo({
            ...formInfo,
            'category': checkedCategory,
            'tag': checkedTag
        })
    }

    const updateRespectiveStates = ( data ) => {
        let parsedData = JSON.parse( data )
        // console.log( Object.entries( parsedData ) )
        newData( parsedData )
        setFormInfo( data )
    }

    // handle title and excerpt change
    const handleTitleExcerptChange = ( event ) => {
        let elementName = event.target.name
        let elementValue = event.target.value
        setFormInfo({
            ...formInfo,
            [elementName]: elementValue
        })
    }
    
    // handle sidebar element click
    const handleSidebarElementClick = ( element ) => {
        setActiveSidebarElement( element )
    }

    // handle add new category click
    const handleCategoryAddClick = ( event ) => {
        setCategoryList([...categoryList, categoryItem ])
        setCategoryItem({ label: '', slug: '' })
        event.preventDefault()
    }

    // handle add new tag click
    const handleTagAddClick = ( event ) => {
        setTagList([ ...tagList, tagItem ])
        setTagItem({ label: '', slug: '' })
        event.preventDefault()
    }

    // handle add new category change
    const handleAddNewCategoryChange = ( event ) => {
        let value = event.target.value
        setCategoryItem({
            label: value, slug: value
        })
    }

    // handle add new category change
    const handleAddNewTagChange = ( event ) => {
        let value = event.target.value
        setTagItem({
            label: value, slug: value
        })
    }

    // handle category checkbox change
    const handleCategoryCheckboxChange = ( event ) => {
        let value = event.target.value
        if( event.target.checked ) {
            setCheckedCategory([
                ...checkedCategory,
                { label: value, slug: value }
            ])
        }
    }

    // handle tags checkbox change
    const handleTagCheckboxChange = ( event ) => {
        let value = event.target.value
        if( event.target.checked ) {
            setCheckedTag([
                ...checkedTag,
                { label: value, slug: value }
            ])
        }
    }

    return (
        <>
            <div className='swt-admin-editor' id='swt-admin-editor'>
                <div className='editor-inner'>
                    <span className='editor-close' onClick={ () => { editorClose() } }>X</span>
                    <form onSubmit={ handleFormSubmit } >
                        <div className='editor-area'>
                            <div className='editor-main'>
                                <input type='text' placeholder='Title' name={ prefix + '_title' } id={ prefix + '_title' } onChange={ handleTitleExcerptChange } />
                                <textarea placeholder='Description' name={ prefix + '_excerpt' } id={ prefix + '_excerpt' } rows='15' onChange={ handleTitleExcerptChange }></textarea>
                            </div>
                            <div className='editor-sidebar'>
                                <button className='editor-submit'>Publish</button>
                                <div className='sidebar-elements-wrap'>
                                   { taxonomy &&  <div className={'sidebar-element category' + ( activeSidebarElement === 'category' ? ' isactive': '' )} onClick={ () => ( handleSidebarElementClick( 'category' ) ) }>
                                        <span className='element-head'>Category</span>
                                        { ( activeSidebarElement == 'category' ) && <EditorComponentTag 
                                            label = 'Category'
                                            attribute = 'category'
                                            changeEvent = { handleAddNewCategoryChange }
                                            currentItem = { categoryItem }
                                            currentList = { categoryList }
                                            checkboxChange = { handleCategoryCheckboxChange }
                                            buttonEvent = { handleCategoryAddClick }
                                            buttonLabel = 'Add Category'
                                        /> }
                                    </div> }
                                    { taxonomy && <div className={'sidebar-element tag' + ( activeSidebarElement === 'tag' ? ' isactive': '' )} onClick={ () => ( handleSidebarElementClick( 'tag' ) ) }>
                                        <span className='element-head'>Tags</span>
                                        { ( activeSidebarElement == 'tag' ) && <EditorComponentTag 
                                            label = 'Tags'
                                            attribute = 'tags'
                                            changeEvent = { handleAddNewTagChange }
                                            currentItem = { tagItem }
                                            currentList = { tagList }
                                            checkboxChange = { handleTagCheckboxChange }
                                            buttonEvent = { handleTagAddClick }
                                            buttonLabel = 'Add Tag'
                                        /> }
                                    </div> }
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

const EditorComponentTag = ({ attribute, changeEvent, currentItem, currentList, checkboxChange, buttonEvent, buttonLabel  }) => {
    return (
        <div className='element-body'>
            <input type='text' placeholder={ 'Add new ' + attribute } name={ attribute } id={ attribute } onChange={ changeEvent } value={ currentItem.label }/>
            <div className={ attribute + '-list' }>
                { currentList.map(( element, index ) => { 
                    return (
                        <p key={ index } className={ attribute + '-item' }>
                            <input type='checkbox' value={ element.slug } id={ element.slug } onChange={ checkboxChange }/>
                            <label htmlFor={ element.slug }>{ element.label }</label>
                        </p>
                    )
                })}
            </div>
            <button className={ 'add-new-' + attribute } onClick={ buttonEvent }>{ buttonLabel }</button>
        </div>
    );
}