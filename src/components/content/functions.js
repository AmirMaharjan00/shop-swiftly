import React, { useState, useEffect } from 'react'

export const GetTaxonomy = () => {
    const [ categories, setCategories ] = useState([])

    useEffect(() => {
        fetchFunction({
            action: 'select',
            tableIdentity: 'category',
            setterFunction: setCategories
        })
    }, [])

    return(
        <ul className='categories-wrapper'>
            {
                ( Array.isArray( categories ) && categories.length > 0 ) && categories.map(( current, index ) => {
                    const CategoryTitle = current.category_title
                    const Count = index + 1
                    if( Count > 5 ) return
                    return <li className='category' key={ index }>
                        <figure className='cat-thumb-wrapper no-image'>
                            <img src='' />
                        </figure>
                        <span className='category-title'>{ CategoryTitle }</span>
                    </li>
                })
            }
        </ul>
    );
}

export const fetchFunction = async ( props ) => {
    const { action, tableIdentity, setterFunction, post, query = '' } = props
    const FORMDATA = new FormData()
    FORMDATA.append( 'action', action )
    FORMDATA.append( 'table_identity', tableIdentity )
    FORMDATA.append( 'query', query )
    if( post !== undefined ) FORMDATA.append( 'post', post )
    await fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', {
        method: 'POST',
        body: FORMDATA
    })
    .then(( result ) => result.json() )
    .then( ( data ) => setterFunction( data ))
}