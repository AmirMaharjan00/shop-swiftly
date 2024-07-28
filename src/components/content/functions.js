import React, { useState, useEffect } from 'react'

export const GetTaxonomy = () => {
    const [ categories, setCategories ] = useState([])

    useEffect(() => {
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php?swt_category=get_table_data' )
        .then(( result ) => result.json() )
        .then( ( data ) => setCategories( (data == null) ? [] : data ))
    }, [])

    useEffect(() => {
        // console.log( categories )
    }, [ categories ])

    return(
        <ul className='categories-wrapper'>
            {
                ( Array.isArray( categories ) && categories.length > 0 ) && categories.map(( current, index ) => {
                    const CategoryTitle = current.category_title
                    const Count = index + 1
                    if( Count > 5 ) return
                    return <li className='category'>
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