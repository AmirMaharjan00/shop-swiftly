import React, { useState, useEffect } from 'react'
import { GetTaxonomy, fetchFunction } from '../functions'
import { Content } from '../template-parts/content'
import { SectionWrapper } from './extras'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowRight, faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Single } from '../single'

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
                            spaceBetween = { 0 }
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
                                    const { post_title: title, post_image: image, post_excerpt: excerpt } = current
                                    return <SwiperSlide className='item' key={ index }>
                                        <figure className='thumbnail-wrapper'>
                                            <img src={ image } alt=''/>
                                            <div className='post-elements'>
                                                <h2 className='post-title'>{ title }</h2>
                                                <p className="post-excerpt">{ excerpt }</p>
                                            </div>
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
        <SectionWrapper main='swt-category-collection'>
            <GetTaxonomy />
        </SectionWrapper>
    )
}

export const TrendingProducts = () => {
    const [ posts, setPosts ] = useState([])

    useEffect(() => {
        fetchFunction({
            action: 'select',
            tableIdentity: 'post',
            setterFunction: setPosts
        })
    }, [])

    return(
        <SectionWrapper main='swt-trending-products'>
            <div className='trending-products-wrapper'>
                <h2 className='section-header'>{ '# Trending Products #' }</h2>
                <div className='section-menu'>
                    <button className='menu-item active'>{ 'Featured' }</button>
                    <button className='menu-item'>{ 'Latest' }</button>
                    <button className='menu-item'>{ 'Bestseller' }</button>
                </div>
                <Swiper
                    slidesPerView = { 4 }
                    loop = { true }
                    navigation = {{
                        nextEl: 'next',
                        prevEl: 'prev'
                    }}
                    modules = {[ Navigation ]}
                    className = "mySwiper"
                >
                    {
                        posts.map(( current, index ) => {
                            return <SwiperSlide className='item' key={ index }>
                                <Content post={ current } exclude={[ 'excerpt' ]}/>
                            </SwiperSlide>
                        })
                    }
                </Swiper>
                <div className='section-pagination'>
                    <button className='pagination-item prev'>
                        <FontAwesomeIcon
                            icon = { faCircleArrowLeft } 
                            className = 'button-icon'
                        />
                        <span className='button-label'>{ 'Prev' }</span>
                    </button>
                    <button className='pagination-item next'>
                        <span className='button-label'>{ 'Next' }</span>
                        <FontAwesomeIcon
                            icon = { faCircleArrowRight } 
                            className = 'button-icon'
                        />
                    </button>
                </div>
            </div>
        </SectionWrapper>
    );
}