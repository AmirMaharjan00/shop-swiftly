import react, { useMemo } from 'react'
import Header from './header'
import Footer from './footer'
import { useLocation } from 'react-router-dom';
import { SectionWrapper } from './inc/extras'
import { useQuery, usePostRelatedHooks } from './inc/hooks'
import { Sidebar } from './sidebar'

export const Search = () => {
    const location = useLocation();

    const { search } = location.state || {}

    return (
        <>

            <Header />
            <SectionWrapper main='searched-wrapper'>
                <h2 className='search-title'>{ 'Searched for : ' + search }</h2>
            </SectionWrapper>
            <SectionWrapper main='searched-results-section'>
                <div className='searched-results-wrapper'>
                    <SearchedResults search={ search }/>
                    <Sidebar />
                </div>
            </SectionWrapper>
            <Footer />
        </>
    );
}

const SearchedResults = ( props ) => {
    const { search } = props
    const { posts } = useQuery( 'post' )
    const { getTheDate, getCategory } = usePostRelatedHooks()
    
    /**
     * Searched
     * 
     * @since 1.0.0
     */
    const matchedResults = useMemo(() => {
        if( posts.length > 0 ) {
            return posts.reduce(( newValue, post ) => {
                const { post_title: title, post_status: status, post_excerpt: excerpt } = post
                if( status === 'publish' && ( title.toLowerCase().includes( search.toLowerCase() ) || excerpt.toLowerCase().includes( search.toLowerCase() ) ) ) {
                    newValue = [ ...newValue, post ]
                }
                return newValue
            }, [])
        }
        return []
    }, [ posts ])

    return <main className='searched-results'>
        {
            ( matchedResults.length > 0 ) && matchedResults.map(( post, index ) => {
                const { post_image: image, post_title: title, post_date: date, post_category: category, post_excerpt: excerpt } = post
                return <article className='post' key={ index }>
                    <figure className='post-thumb-wrapper'>
                        <img src={ image } alt={ title } className='post-thumb'/>
                    </figure>
                    <div className='post-elements'>
                        <h2 className='post-title'>{ title }</h2>
                        <div className='post-meta'>
                            <span className='post-date'>{ getTheDate( date ) }</span>
                            <span className='post-category'>{ getCategory( category ) }</span>
                        </div>
                        <p className='post-excerpt'>{ excerpt.split(" ").slice(0, 30).join(" ") + "..." }</p>
                    </div>
                </article>
            })
        }
    </main>
} 