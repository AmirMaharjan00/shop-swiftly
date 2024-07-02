import React from 'react'
import { GetTaxonomy } from '../functions'

export const MainBanner = () => {
    return(
        <section className="swt-main-banner">
            <div className='container'>
                <div className='row'>
                    
                </div>
            </div>
        </section>
    )
}

export const CategoryCollection = () => {
    return(
        <section className="swt-category-collection">
            <div className='container'>
                <div className='row'>
                    <GetTaxonomy />
                </div>
            </div>
        </section>
    )
}