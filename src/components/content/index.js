import React from 'react'
import Header from './header'
import Footer from './footer'
import { Archive } from './archive'
import { Sidebar } from './sidebar'
import { MainBanner, CategoryCollection, TrendingProducts, GridView } from './inc/helpers'

export default function Index () {
    return (
        <>
            <Header />
            <MainBanner />
            <TrendingProducts />
            <GridView />
            {/* <div id="masthead" className="masthead">
                <div className='container'>
                    <div className='row'>
                        <Archive/>
                        <Sidebar/>
                    </div>
                </div>
            </div> */}
            {/* <CategoryCollection/> */}
            <Footer/>
        </>
    );
}