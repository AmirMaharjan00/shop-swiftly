import React, { useState, useEffect } from 'react'

export default function Taxonomy( props ) {
    const [ list, setList ] = useState([])
    const [ searched, setSearched ] = useState( '' )
    const [ checkedTaxonomy, setCheckecTaxonomuy ] = useState([])
    const PLACEHOLDER = props.placeholder
    const LABEL = props.label
    const BUTTONLABEL = props.buttonLabel
    const TYPE = props.type
    const DEFAULT = [{ 'category_title': 'Uncategorized', 'category_slug': 'uncategorized' }]
    const API = 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php?swt_'+ TYPE +'=get_table_data'
    const ACTIVECLASS = props.activeClass

    useEffect(() => {
        fetch( API )
        .then(( result ) => result.json())
        .then( ( data ) => { setList( TYPE === 'tag' ? [ ...data ] : [ ...DEFAULT, ...data ] ) } )
    }, [])

    useEffect(() => {
        props.handleCheckbox( checkedTaxonomy )
    }, [ checkedTaxonomy ])

    /**
     * Handle Search field change
     * 
     * @since 1.0.0
     * @package Shop Swiftly
     */
    const handleSearchFieldChange = ( event ) => {
        let search = event.target.value
        setSearched( search )
    }

    /**
     * Handle checkbox field change
     * 
     * @since 1.0.0
     */
    const handleCheckboxFieldChange = ( event ) => {
        let value = event.target.value
        let checked = event.target.checked
        if( checked ) {
            setCheckecTaxonomuy([ ...checkedTaxonomy, value ])
        } else {
            setCheckecTaxonomuy( checkedTaxonomy.filter( current => current !== value ) )
        }
    }

    /**
     * Handle event to add new taxonomy
     * 
     * @since 1.0.0
     * @package Shop Swiftly
     */
    const handleAddingNewTaxonomy = ( event ) => {
        event.preventDefault()
        event.stopPropagation()
        if( searched === '' ) return
        let newItem = { 'label': searched, 'slug': searched.toLowerCase(), 'date': Date.now() }
        handleInsertingIntoDatabase( newItem )
    }

    /**
     * Inserting new taxonomy in the database
     * 
     * @since 1.0.0
     * @package Shop Swiftly
     */
    const handleInsertingIntoDatabase = ( newItem ) => {
        const FORMDATA = new FormData()
        FORMDATA.append( 'action', 'insert' )
        FORMDATA.append( TYPE + '_title', newItem.label )
        FORMDATA.append( TYPE + '_slug', newItem.slug )
        FORMDATA.append( TYPE + '_date', newItem.date )
        FORMDATA.append( TYPE + '_excerpt', '' )
        FORMDATA.append( 'post_type', TYPE )
        fetch( API, {
            method: 'POST',
            body: FORMDATA
        })
        .then(( result ) => result.json())
        .then( ( data ) => { setList( TYPE === 'tag' ? [ ...data ] : [ ...DEFAULT, ...data ] ) } )
    }

    return (
        <div className={ 'sidebar-element taxonomy' + ( ACTIVECLASS ? ' isactive' : '' ) } onClick={() => props.updateActiveClass( TYPE ) }>
            <span className='element-head'>{ LABEL }</span>
            <div className='element-body'>
                <input type='search' placeholder={ PLACEHOLDER } onChange={( event ) => handleSearchFieldChange( event )}/>
                <div className='taxonomy-list'>
                    {
                        list.map( ( current, index ) => {
                            const ID = current[ TYPE + '_id' ]
                            return <p key={ index } className={ 'taxonomy-item' }>
                                <input type='checkbox' id={ ID } value={ ID } onChange={( event ) => handleCheckboxFieldChange( event ) }/>
                                <label htmlFor={ ID }>{ current[ TYPE + '_title' ] }</label>
                            </p>
                        } )
                    }
                </div>
                <button className={ 'add-new-taxonomy' } onClick={ handleAddingNewTaxonomy }>{ BUTTONLABEL }</button>
                <input type="hidden" id={ "post_" + ( TYPE === 'category' ? 'category' : 'tags' ) } value={ checkedTaxonomy.join(',') }/>
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