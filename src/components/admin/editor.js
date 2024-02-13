import React, { useState } from 'react'

export default function Editor( { editorClose } ) {
    const [ formInfo, setFormInfo ] = useState({})
    const [ activeSidebarElement, setActiveSidebarElement ] = useState( 'category' )
    const [ categoryList, setCategoryList ] = useState([{ label: 'uncategorized', slug: 'uncategorized' }])
    const [ categoryItem, setCategoryItem ] = useState({})
    const [ tagList, setTagList ] = useState([])
    const [ tagItem, setTagItem ] = useState({})

    // handle form submit
    const handleFormSubmit = () => {

    }
    
    // handle sidebar element click
    const handleSidebarElementClick = ( element ) => {
        setActiveSidebarElement( element )
    }

    // handle add new category click
    const handleCategoryAddClick = ( event ) => {
        categoryList.push( categoryItem )
        setCategoryList( categoryList )
        setCategoryItem({ label: '', slug: '' })
        event.preventDefault()
    }

    // handle add new tag click
    const handleTagAddClick = ( event ) => {
        tagList.push( tagItem )
        setTagList( tagList )
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

    return (
        <>
            <div className='swt-admin-editor' id='swt-admin-editor'>
                <div className='editor-inner'>
                    <span className='editor-close' onClick={ () => { editorClose() } }>X</span>
                    <form onSubmit={ handleFormSubmit } >
                        <div className='editor-area'>
                            <div className='editor-main'>
                                <input type='text' placeholder='Title' name='product_name' id='product_name' />
                                <textarea placeholder='Description' name='product_description' id='product_description' rows='15'></textarea>
                            </div>
                            <div className='editor-sidebar'>
                                <button className='editor-submit'>Publish</button>
                                <div className='sidebar-elements-wrap'>
                                    <div className={'sidebar-element category' + ( activeSidebarElement === 'category' ? ' isactive': '' )} onClick={ () => ( handleSidebarElementClick( 'category' ) ) }>
                                        <span className='element-head'>Category</span>
                                        { ( activeSidebarElement == 'category' ) && <EditorComponentTag 
                                            label = 'Category'
                                            attribute = 'category'
                                            changeEvent = { handleAddNewCategoryChange }
                                            currentItem = { categoryItem }
                                            currentList = { categoryList }
                                            buttonEvent = { handleCategoryAddClick }
                                            buttonLabel = 'Add Category'
                                        /> }
                                    </div>
                                    <div className={'sidebar-element tag' + ( activeSidebarElement === 'tag' ? ' isactive': '' )} onClick={ () => ( handleSidebarElementClick( 'tag' ) ) }>
                                        <span className='element-head'>Tags</span>
                                        { ( activeSidebarElement == 'tag' ) && <EditorComponentTag 
                                            label = 'Tags'
                                            attribute = 'tags'
                                            changeEvent = { handleAddNewTagChange }
                                            currentItem = { tagItem }
                                            currentList = { tagList }
                                            buttonEvent = { handleTagAddClick }
                                            buttonLabel = 'Add Tag'
                                        /> }
                                    </div>
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

const EditorComponentTag = ({ attribute, changeEvent, currentItem, currentList, buttonEvent, buttonLabel  }) => {
    return (
        <div className='element-body'>
            <input type='text' placeholder={ 'Add new ' + attribute } name={ attribute } id={ attribute } onChange={ changeEvent } value={ currentItem.label }/>
            <div className={ attribute + '-list' }>
                { currentList.map(( element, index ) => { 
                    return (
                        <p key={ index } className={ attribute + '-item' }>
                            <input type='checkbox' value={ element.slug } id={ element.slug } />
                            <label htmlFor={ element.slug }>{ element.label }</label>
                        </p>
                    )
                })}
            </div>
            <button className={ 'add-new-' + attribute } onClick={ buttonEvent }>{ buttonLabel }</button>
        </div>
    );
}