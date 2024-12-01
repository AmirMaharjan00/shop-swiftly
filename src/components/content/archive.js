import React, { useState, useEffect, useMemo, useContext, createContext } from 'react'
import { fetchFunction } from './functions'
import { useLocation  } from 'react-router-dom'
import Header from './header'
import Footer from './footer'
import { SectionWrapper } from './inc/extras'
import { usePostRelatedHooks } from './inc/hooks'
import { Link } from 'react-router-dom';
import { Sidebar } from './sidebar'

const ARCHIVECONTEXT = createContext( null );

export const Archive = () => {
    const { state } = useLocation()
    const { ID } = state
    const [ allCategories, setAllCategories ] = useState([])
    const [ isUserloggedIn, setIsUserLoggedIn ] = useState( false )

    useEffect(() => {
        fetchFunction({
            action: 'select_where',
            tableIdentity: 'category',
            setterFunction: setAllCategories,
            post: ID
        })
        if( sessionStorage.length > 0 ) {
            const userId = sessionStorage.getItem( 'userId' )
            const loggedIn = sessionStorage.getItem( 'loggedIn' )
            setIsUserLoggedIn( loggedIn === 'true' )
        }
    }, [])

    return (
        <>
            <Header />
            <ARCHIVECONTEXT.Provider value={{ isUserloggedIn }}>
                <ArchiveContent post={ allCategories } />
            </ARCHIVECONTEXT.Provider>
            <Footer />
        </>
    );
}

export const ArchiveContent = ( props ) => {
    console.log( props.post )
    const [ posts, setPosts ] = useState([])
    const { category_id: catId, category_title: title } = props.post

    const archivePosts = useMemo(() => {
        return posts.filter(( post ) => {
            const { post_category: _thisCat } = post
            return _thisCat.includes( catId )
        })
    }, [ posts ])

    useEffect(() => {
        fetchFunction({
            action: 'select',
            tableIdentity: 'post',
            setterFunction: setPosts
        })
    }, [])

    return <SectionWrapper main='archive-wrapper'>
        <h2 className='category-title'>{ title }</h2>
        <div className='post-wrapper'>
            <main>
            {
                archivePosts.map(( post, index ) => {
                    const { post_id: ID, post_title: title, post_image: image, post_excerpt: excerpt, post_status: status, post_category: category } = post
                    if( status !== 'publish' ) return
                    return <article className='post' key={ index }>
                        <figure className='thumbnail-wrapper'>
                            <img src={ image } alt=''/>
                        </figure>
                        <div className='post-elements'>
                            <h2 className='post-title'><Link to='/single' state={{ ID: ID }}>{ title }</Link></h2>
                            <p className="post-excerpt">{ excerpt.split(" ").slice(0, 10).join(" ") + "..." }</p>
                        </div>
                    </article>
                })
            }
            </main>
            {/* <Sidebar /> */}
        </div>
    </SectionWrapper>
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

    return <div className='category-collection'>
        <div className='header'>
            <h2 className='title'>{ 'Categories' }</h2>
        </div>
        <div className='collection'>
            {
                categories.map(( cat, index ) => {
                    if( index >= 4 ) return
                    const { category_title: title, category_date: date } = cat
                    return <article className='category' key={ index }>
                        <figure className='cat-thumbnail-wrapper no-image'>
                            <img src="" alt=""/>
                        </figure>
                        <div className='category-elements'>
                            <h2 className='cat-title'>{ title }</h2>
                            <span className='cat-date'>{ getTheDate( date ) }</span>
                        </div>
                    </article>
                })
            }
        </div>
    </div>
}