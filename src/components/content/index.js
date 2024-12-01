import React, { useEffect } from 'react'
import Header from './header'
import Footer from './footer'
import { useLocation, useNavigate } from 'react-router-dom';
import { useSession } from './inc/hooks'
import { MainBanner, TrendingProducts, GridView, YouTube } from './inc/helpers'

export default function Index () {
    const location = useLocation()
    const navigate = useNavigate()
    const { userId, loggedIn, parsedProductDetails } = useSession()
    const queryParams = new URLSearchParams( location.search );
    const checkoutComplete = queryParams.get('oid');
    
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
            FORMDATA.append( 'order_status', 'pending' )
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

    return <>
        <Header />
        <MainBanner />
        <TrendingProducts />
        <GridView />
        <YouTube />
        <Footer/>
    </>
}