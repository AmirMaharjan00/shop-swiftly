import React, { useState, useEffect } from 'react'
import { GetTaxonomy, fetchFunction } from '../functions'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export const MainBanner = () => {
    const [ posts, setPosts ] = useState([])

    useEffect(() => {
        fetchFunction({
            action: 'select',
            tableIdentity: 'post',
            setterFunction: setPosts
        })
    }, [])

    return(
        <section className="swt-main-banner">
            <div className='full-container'>
                <div className='row'>
                    <div className='main-banner-wrapper'>
                        <Swiper
                            slidesPerView = { 1 }
                            spaceBetween = { 30 }
                            loop = { true }
                            pagination = {{
                                clickable: true,
                            }}
                            navigation = { true }
                            modules = {[ Pagination, Navigation ]}
                            className = "mySwiper"
                        >
                            {
                                posts.map(( current, index ) => {
                                    const { post_title: title, post_image: image } = current
                                    return <SwiperSlide className='item' key={ index }>
                                        <figure className='thumbnail-wrapper'>
                                            <img src={ image } alt=''/>
                                            {/* <div className='post-elements'>
                                                <h2 className='post-title'>{ title }</h2>
                                            </div> */}
                                        </figure>
                                    </SwiperSlide>
                                })
                            }
                        </Swiper>
                    </div>
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