import React from 'react'
import Header from './header'
import Footer from './footer'
import { MainBanner } from './inc/helpers'

export default function Index () {
    return (
        <>
            <Header/>
            <MainBanner/>
            <Footer/>
        </>
    );
}