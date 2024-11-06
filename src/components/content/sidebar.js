import react, { useState, useEffect } from 'react'
import { usePostRelatedHooks } from './inc/hooks'
import { Link } from 'react-router-dom';
import { fetchFunction } from './functions'

export const Sidebar = () => {
    return (
        <aside className='sidebar-wrapper'>
            <div className='row'>
                <CategoryList/>
            </div>
        </aside>
    );
}

/**
 * Category list
 * 
 * @since 1.0.0
 */
export const CategoryList = () => {
    const [ categories, setCategories ] = useState([])
    const { getTheDate } = usePostRelatedHooks()

    useEffect(() => {
        fetchFunction({
            action: 'select',
            tableIdentity: 'category',
            setterFunction: setCategories
        })
    }, [])

    return <div className='category-collection widget'>
        <div className='header'>
            <h2 className='title'>{ 'Categories' }</h2>
        </div>
        <div className='collection'>
            {
                categories.map(( cat, index ) => {
                    if( index >= 4 ) return
                    const { category_id: ID, category_title: title, category_date: date } = cat
                    return <article className='category' key={ index }>
                        <figure className='cat-thumbnail-wrapper no-image'>
                            <img src="" alt=""/>
                        </figure>
                        <div className='category-elements'>
                            <h2 className='cat-title'><Link to='/archive' state={{ ID: ID }}>{ title }</Link></h2>
                            <span className='cat-date'>{ getTheDate( date ) }</span>
                        </div>
                    </article>
                })
            }
        </div>
    </div>
}