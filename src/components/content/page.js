import React, { useState, useEffect, useContext, createContext } from 'react'
import { useLocation  } from 'react-router-dom'
import Header from './header'
import Footer from './footer'
import { usePages, useSession } from './inc/hooks'
import { SectionWrapper } from './inc/extras'
import { Sidebar } from './sidebar'
import { HOMECONTEXT } from '../../App'

const SINGLECONTEXT = createContext( null );

export const Page = () => {
    const { state } = useLocation()
    const { ID } = state
    const { getPageDetailsFunction } = usePages()
    const { userId } = useSession()
    const [ isUserloggedIn, setIsUserLoggedIn ] = useState( false )   

    const contextObject = {
        page: getPageDetailsFunction( ID ),
        isUserloggedIn
    }

    return (
        <>
            <Header homeContext={ HOMECONTEXT }/>
            <SINGLECONTEXT.Provider value={ contextObject }>
                <SingleContent />
            </SINGLECONTEXT.Provider>
            <Footer />
        </>
    );
}

const SingleContent = () => {
    const Global = useContext( SINGLECONTEXT )
    const { isUserloggedIn, page } = Global
    let title = '', excerpt = '', image = ''
    if( page !== undefined ) {
        title = page.page_title
        excerpt = page.page_excerpt
        image = page.page_image
    }

    return <SectionWrapper main='page-wrapper' id="swt-page">
        <div className='post-wrapper'>
            <main className='main-article'>
                <h2 className='post-title'>{ title }</h2>
                <figure className={ 'post-thumbnail-wrapper' + ( image ? '' : ' no-image' ) }>
                    <img src={ image } alt=""/>
                </figure>
                <div className='element-excerpt'>
                    <p className='post-excerpt'>{ excerpt }</p>
                </div>
            </main>
            <Sidebar />
        </div>
    </SectionWrapper>
}