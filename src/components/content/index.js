import React, { useEffect, useState, createContext, useContext } from 'react'
import Header from './header'
import Footer from './footer'
import { useLocation, useNavigate } from 'react-router-dom';
import { useSession } from './inc/hooks'
import { MainBanner, CategoryCollection, TrendingProducts, GridView, YouTube } from './inc/helpers'
export const HOMECONTEXT = createContext()

export default function Index () {
    const location = useLocation()
    const navigate = useNavigate()
    const { userId, loggedIn, parsedProductDetails } = useSession()
    const queryParams = new URLSearchParams( location.search );
    const checkoutComplete = queryParams.get('oid');
    const [ overlay, setOverlay ] = useState( false )
    const [ cartActive, setCartActive ] = useState( false )

    const contextObject = {
        setOverlay,
        overlay,
        cartActive,
        setCartActive
    }
    
    useEffect(() => {
        if( checkoutComplete && loggedIn && parsedProductDetails.length > 0 ) {
            const FORMDATA = new FormData()
            FORMDATA.append( 'action', 'insert' )
            FORMDATA.append( 'post_type', 'order' )
            FORMDATA.append( 'table_identity', 'order' )
            FORMDATA.append( 'order_date', Date.now() )
            FORMDATA.append( 'product_id', parsedProductDetails.toString() )
            FORMDATA.append( 'user_id', userId )
            FORMDATA.append( 'order_price', 100 )
            FORMDATA.append( 'order_quantity', 1 )
            fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', {
                method: 'POST',
                body: FORMDATA
            })
            .then(( result ) => result.json())
            .then(( data ) => {
                if( data.length > 0 ) {
                    sessionStorage.setItem( 'productDetails', JSON.stringify([]) )
                    navigate('/')
                }
            })
        }
        return
    }, [])

    return (
        <HOMECONTEXT.Provider value={ contextObject }>
            <Overlay />
            <Header />
            <MainBanner />
            <TrendingProducts />
            <GridView />
            <YouTube />
            <Footer/>
        </HOMECONTEXT.Provider>
    );
}

const Overlay = () => {
    const homeContext = useContext( HOMECONTEXT )
    const { setOverlay, overlay, setCartActive } = homeContext
    const CLASS = 'full-page-overlay' + ( overlay ? ' active' : '' ) 
    /**
     * Handle overlay click
     * 
     * @since 1.0.0
     */
    const handleClick = () => {
        setOverlay( false )
        setCartActive( false )
    }
    return <div className={ CLASS } onClick={ handleClick }></div>
}