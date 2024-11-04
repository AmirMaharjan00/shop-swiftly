import React from 'react'
import Header from './header'
import Footer from './footer'
import { MainBanner, CategoryCollection, TrendingProducts, GridView, YouTube } from './inc/helpers'

export default function Index () {
    return (
        <>
            <Header />
            <MainBanner />
            <TrendingProducts />
            <GridView />
            <YouTube />
            <Footer/>
        </>
    );
}