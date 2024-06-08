import React, { useState, useEffect } from 'react'

export default function Taxonomy( props ) {
    // props.taxonomyList
    const [ list, setList ] = useState([])
    const [ newTaxonomy, setNewTaxonomy ] = useState({})
    const [ searched, setSearched ] = useState( '' )
    const PLACEHOLDER = props.placeholder
    const LABEL = props.label
    const BUTTONLABEL = props.buttonLabel
    const TYPE = props.type
    const DEFAULT = [{ 'category_title': 'Uncategorized', 'category_slug': 'uncategorized' }]

    useEffect(() => {
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php?swt_category=get_table_data' )
        .then(( result ) => result.json())
        .then( ( data ) => { setList([ ...DEFAULT, ...data ]) } )
    }, [])

    /**
     * Handle Search field change
     * 
     * @since 1.0.0
     * @package Shop Swiftly
     */
    const handleSearchFieldChange = ( event ) => {
        let search = event.target.value
        setSearched( search )
        props.handleSearchField( event )
    }

    /**
     * Handle event to add new taxonomy
     * 
     * @since 1.0.0
     * @package Shop Swiftly
     */
    const handleAddingNewTaxonomy = ( event ) => {
        // event.preventDefault()
        // event.stopPropagation()
        if( searched == '' ) return
        let newItem = { 'label': searched, 'slug': searched.toLowerCase(), 'date': Date.now() }
        setNewTaxonomy( newItem )
        handleInsertingIntoDatabase( newItem )
    }

    /**
     * Inserting new taxonomy in the database
     * 
     * @since 1.0.0
     * @package Shop Swiftly
     */
    const handleInsertingIntoDatabase = ( newItem ) => {
        var bodyParams = {
            [ TYPE + '_title' ] : newItem.label,
            [ TYPE + '_slug' ] : newItem.slug,
            [ TYPE + '_date' ] : newItem.date,
            [ TYPE + '_excerpt' ] : ''
        }
        let apiParameters = {
            method: 'POST',
            body: JSON.stringify({
                'params' : bodyParams,
                'post_type' : TYPE
            })
        }
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php?swt_category=get_table_data', apiParameters )
        .then(( result ) => result.json())
        .then( ( data ) => { setList([ ...DEFAULT, ...data ]) } )
    }

    return (
        <div className='sidebar-element taxonomy'>
            <h2 className='element-head'>{ LABEL }</h2>
            <div className='element-body'>
                <input type='search' placeholder={ PLACEHOLDER } onChange={( event ) => handleSearchFieldChange( event )}/>
                <div className='taxonomy-list'>
                    {
                        list.map( ( current, index ) => {
                            const SLUG = current.category_slug
                            return <p key={ index } className={ 'taxonomy-item' }>
                                <input type='checkbox' value={ SLUG } onChange={( event ) => props.handleCheckbox( event ) }/>
                                <label htmlFor={ SLUG }>{ current.category_title }</label>
                            </p>
                        } )
                    }
                </div>
                <button className={ 'add-new-taxonomy' } onClick={ handleAddingNewTaxonomy }>{ BUTTONLABEL }</button>
            </div>
        </div>
    )
}

Taxonomy.defaultProps = {
    type: 'category',
    label: 'Category',
    placeholder: 'Add New Category',
    buttonLabel: 'Add Category'
}