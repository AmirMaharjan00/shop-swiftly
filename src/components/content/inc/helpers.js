import React, { useState, useEffect, useMemo, useContext } from 'react'
import { HOMECONTEXT } from '../../../App'
import { GetTaxonomy, fetchFunction } from '../functions'
import { Content } from '../template-parts/content'
import { SectionWrapper } from './extras'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowRight, faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { usePostRelatedHooks, useOptions, useUsers } from './hooks'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Link } from 'react-router-dom';

export const MainBanner = () => {
    const [ posts, setPosts ] = useState([])
    const [ swiperInstance, setSwiperInstance ] = useState( null );

    useEffect(() => {
        fetchFunction({
            action: 'select',
            tableIdentity: 'post',
            setterFunction: setPosts
        })
        if ( swiperInstance ) swiperInstance.autoplay.start(); // Ensure autoplay starts after component is mounted
    }, [])

    return(
        <section className="swt-main-banner">
            <div className='full-container'>
                <div className='row'>
                    <div className='main-banner-wrapper'>
                        <Swiper
                            modules={[ Navigation, Autoplay ]}
                            slidesPerView = { 1 }
                            spaceBetween = { 0 }
                            loop = { true }
                            pagination = {{
                                clickable: true,
                            }}
                            autoplay={{
                                delay: 3000,          // Delay between transitions (in milliseconds)
                                disableOnInteraction: false,  // Continue autoplay even after interaction
                            }}
                            navigation
                            className = "mySwiper"
                            onSwiper = { setSwiperInstance }
                        >
                            {
                                posts.map(( current, index ) => {
                                    if( index > 4 ) return
                                    const { post_title: title, post_image: image, post_excerpt: excerpt, post_id, post_status: status } = current
                                    if( status !== 'publish' ) return
                                    return <SwiperSlide className='item' key={ index }>
                                        <figure className='thumbnail-wrapper'>
                                            <img src={ image } alt=''/>
                                            <div className='post-elements'>
                                                <h2 className='post-title'><Link to="/single" state={{ ID: post_id }}>{ title }</Link></h2>
                                                <p className="post-excerpt">{ excerpt.split(" ").slice(0, 10).join(" ") + "..." }</p>
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
    const [ activeTab, setActiveTab ] = useState( 'featured' )
    const [ swiperInstance, setSwiperInstance ] = useState( null );

    useEffect(() => {
        let query = ''
        if( activeTab === 'latest' ) {
            query = 'SELECT * FROM swt_posts WHERE post_status!="trash"'
        } else if( activeTab === 'best-seller' ) {
            query= 'SELECT * FROM swt_posts p INNER JOIN swt_orders o ON p.post_id = o.product_id GROUP BY p.post_title ORDER BY SUM(o.order_quantity) DESC'
        } else {
            query = 'SELECT * FROM swt_posts WHERE is_featured=1 AND post_status!="trash"'
        }
        fetchFunction({
            action: 'query',
            setterFunction: setPosts,
            query
        })
    }, [ activeTab ])

    /* Handle tab click */
    const handleTabClick = ( value ) => {
        if( value !== activeTab ){
            setActiveTab( value )
            if ( swiperInstance ) swiperInstance.slideTo( 0 ); // Reset to the first slide
        }
    }

    return(
        <SectionWrapper main='swt-trending-products'>
            <div className='trending-products-wrapper'>
                <h2 className='section-header'>{ '# Trending Products #' }</h2>
                <div className='section-menu'>
                    <button className={ 'menu-item' + (( activeTab === 'featured' ) ? ' active' : '' )} onClick={() => handleTabClick( 'featured' )}>{ 'Featured' }</button>
                    <button className={ 'menu-item' + (( activeTab === 'latest' ) ? ' active' : '' )} onClick={() => handleTabClick( 'latest' )}>{ 'Latest' }</button>
                    <button className={ 'menu-item' + (( activeTab === 'best-seller' ) ? ' active' : '' )} onClick={() => handleTabClick( 'best-seller' )}>{ 'Bestseller' }</button>
                </div>
                <Swiper
                    onSwiper = { setSwiperInstance }
                    slidesPerView = { 4 }
                    loop = { true }
                    navigation = {{
                        nextEl: '.next',
                        prevEl: '.prev'
                    }}
                    modules = {[ Navigation, Autoplay ]}
                    className = "mySwiper"
                    spaceBetween = { 15 }
                    autoplay={{
                        delay: 2500,          // Delay between transitions (in milliseconds)
                        disableOnInteraction: false,  // Continue autoplay even after interaction
                    }}
                >
                    {
                        (activeTab === 'latest' ? [...posts].reverse() : posts).map(( current, index ) => {
                            return <SwiperSlide className='item' key={ index }>
                                <Content post={ current } exclude={[]}/>
                            </SwiperSlide>
                        })
                    }
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
                </Swiper>
            </div>
        </SectionWrapper>
    );
}

export const SignUp = ({ isSignUpActive, setIsSignUpActive, setIsSignInActive }) => {
    const [ userInfo, setUserInfo ] = useState({})
    const [ nameError, setNameError ] = useState( '*' )
    const [ emailError, setEmailError ] = useState( '*' )
    const [ passwordError, setPasswordError ] = useState( '*' )
    const [ rePasswordError, setRePasswordError ] = useState( '*' )

    /**
     * Register new user
     * 
    * @since 1.0.0
     */
    const register = () => {
        const { name, email, password, reEnterPassword } = userInfo

        if( name === undefined || name === '' ) setNameError( 'Name cannot be empty.' )

        if( email === undefined || email === '' ) setEmailError( 'Email cannot be empty.' )

        if( password === undefined || password === '' ) {
            setPasswordError( 'Password cannot be empty.' )
        } else if( password.length < 6 ){
            setPasswordError( 'Length of password should be atleast 6 characters.' )
        }

        if( reEnterPassword === undefined ) setRePasswordError( 'Cannot be empty.' )

        if( password !== reEnterPassword ) setRePasswordError( 'Passwords don\'t match.' )

        if( name && email && ( password === reEnterPassword ) ) {
            const FORMDATA = new FormData()
            FORMDATA.append( 'action', 'insert' )
            FORMDATA.append( 'post_type', 'user' )
            FORMDATA.append( 'user_name', name )
            FORMDATA.append( 'user_password', password )
            FORMDATA.append( 'user_email', email )
            FORMDATA.append( 'user_role', 'subscriber' )
            FORMDATA.append( 'registered_date', Date.now() )
            fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', {
                method: 'POST',
                body: FORMDATA
            })
            setIsSignInActive( false )
        }
    }

    /**
     * Execute this function to hide sign in popup
     * 
     * @since 1.0.0
     */
    const signUpOutsideClick = ( event ) => {
        event.preventDefault()
        event.stopPropagation()
        const elementArray = Array.from( document.getElementsByClassName('sign-up-wrapper') )
        if( elementArray.includes( event.target ) ) setIsSignInActive( false )
    }

    return (
        <>
            { ( isSignUpActive ) ? <div className='sign-up-wrapper' onClick={( event ) => signUpOutsideClick( event )}>
                <form className='sign-up-inner'>
                    <h2 className='section-header'>{ 'Create account' }</h2>
                    <p className='sign-up-field'>
                        <label htmlFor='your-name'>
                            <span className='form-label'>{ 'Your name' }</span>
                            <span className='form-required'>{ nameError }</span>
                        </label>
                        <input type='text' id="your-name" placeholder='First and last name' required onChange={( event ) => setUserInfo({ ...userInfo, name: event.target.value })} />
                    </p>
                    <p className='sign-up-field'>
                        <label htmlFor='mobile-number-or-email'>
                            <span className='form-label'>{ 'Email' }</span>
                            <span className='form-required'>{ emailError }</span>
                        </label>
                        <input type='email' id="mobile-number-or-email" required onChange={( event ) => setUserInfo({ ...userInfo, email: event.target.value })} />
                    </p>
                    <p className='sign-up-field'>
                        <label htmlFor='password'>
                            <span className='form-label'>{ 'Password' }</span>
                            <span className='form-required'>{ passwordError }</span>
                        </label>
                        <input type='password' id="password" placeholder='At least 6 characters' required onChange={( event ) => setUserInfo({ ...userInfo, password: event.target.value })} />
                    </p>
                    <p className='sign-up-field'>
                        <label htmlFor='re-enter-password'>
                            <span className='form-label'>{ 'Re-enter password' }</span>
                            <span className='form-required'>{ rePasswordError }</span>
                        </label>
                        <input type='password' id="re-enter-password" required onChange={( event ) => setUserInfo({ ...userInfo, reEnterPassword: event.target.value })} />
                    </p>
                    <button type="submit" className='sign-up-button' onClick={() => register()}>{ 'Continue' }</button>
                    <p className='sign-up-field notification'>{ 'By creating an account, you agree to Shop Swiftly\'s condition of use and privacy notice.' }</p>
                    <p className='sign-up-field already-have-account'>
                        { 'Already have an account? ' }
                        <button type="button" onClick={() => setIsSignUpActive( false )}>{ 'Sign in' }</button>
                    </p>
                </form>
            </div> : <SignIn setIsSignInActive={ true } /> }
        </>
    )
}

export const SignIn = ({ setIsSignInActive }) => {
    const [ isSignUpActive, setIsSignUpActive ] = useState( false )
    const [ emailError, setEmailError ] = useState( '*' )
    const [ passwordError, setPasswordError ] = useState( '*' )
    const [ okToStartSession, setOkToStartSession ] = useState( false )
    const [ loginInfo, setLoginInfo ] = useState({})
    const [ userData, setUserData ] = useState({})
    const { email, password } = loginInfo
    const { user_id: userID, user_email: retrievedEmail, user_password: retrievedPassword, user_role } = userData
    const homeContext = useContext( HOMECONTEXT )
    const { setIsAdmin, setIsSubscriber } = homeContext
    const { users } = useUsers()

    /**
     * Execute this function to hide sign in popup
     * 
     * @since 1.0.0
     */
    const signInOutsideClick = ( event ) => {
        event.preventDefault()
        event.stopPropagation()
        const elementArray = Array.from( document.getElementsByClassName('sign-in-wrapper') )
        if( elementArray.includes( event.target ) ) setIsSignInActive( false )
    }

    /**
     * User Login
     * 
     * @since 1.0.0
     */
    const login = () => {
        if( email === undefined || email === '' ) setEmailError( 'Email cannot be empty.' )
        if( password === undefined || password === '' ) setPasswordError( 'Password cannot be empty.' )

        if( email && password ) {
            let data = users.reduce(( newValue, user ) => {
                let { user_email, user_password } = user
                newValue.email = [ ...newValue.email, user_email ]
                newValue.password = [ ...newValue.password, user_password ]
                if( email === user_email && password === user_password ) newValue.user = user
                return newValue
            }, { email: [], password: [], user: {} })
            let { email: userEmails, password: userPasswords, user } = data
            if( ! userEmails.includes( email ) ) setEmailError( 'Email does not exist' )
            if( ! userPasswords.includes( password ) && userEmails.includes( email ) ) {
                if( password.length < 6 ) {
                    setPasswordError( 'Length of password should be atleast 6 characters.' )
                } else {
                    setPasswordError( 'Password does not match' )
                }
            }
            setUserData( user )
        }
    }

    /**
     * Match retrieved values with entered values and grant permission to start session
     * 
     * @since 1.0.0
     */
    useEffect(() => {
        if( Object.keys( userData ).length > 0 ) {
            if( email === retrievedEmail && password === retrievedPassword ) {
                if( user_role.toLowerCase() === 'subscriber' ) {
                    setIsSubscriber( true )
                    setIsAdmin( false )
                }
                if( user_role.toLowerCase() === 'admin' ) {
                    setIsSubscriber( false )
                    setIsAdmin( true )
                }
                setOkToStartSession( true )
            }
        }
    }, [ userData ])

    /**
     * Set Session variables
     * 
     * @since 1.0.0
     */
    useEffect(() => {
        if( okToStartSession ) {
            sessionStorage.setItem( 'loggedIn', true )
            sessionStorage.setItem( 'userId', userID )
            sessionStorage.setItem( 'productDetails', JSON.stringify([]) )
            setIsSignInActive( false )
        }
    }, [ okToStartSession ])

    return (
        <>
            { ! isSignUpActive ? <div className='sign-in-wrapper' onClick={( event ) => signInOutsideClick( event )}>
                <div className='sign-in-inner'>
                    <h2 className='section-header'>{ 'Sign in' }</h2>
                    <p className='sign-in-field'>
                        <label htmlFor='email-or-mobile-number'>
                            <span className='form-label'>{ 'Email' }</span>
                            <span className='form-required'>{ emailError }</span>
                        </label>
                        <input type="email" id="email-or-mobile-number" onChange={( event ) => setLoginInfo({ ...loginInfo, email: event.target.value })} required />
                    </p>
                    <p className='sign-in-field'>
                        <label htmlFor='password'>
                            <span className="form-label">{ 'Password' }</span>
                            <span className="form-required">{ passwordError }</span>
                        </label>
                        <input type="password" id="password" onChange={( event ) => setLoginInfo({ ...loginInfo, password: event.target.value })} required />
                    </p>
                    <button className='sign-in-button' onClick={ login }>{ 'Continue' }</button>
                    <p className='sign-in-field notification'>{ 'By continuing, you agree to Shop Swiftly\'s conditions of use and privacy notice' }</p>
                    <p className='new-to-shop-swiftly'>{ 'New to Shop Swiftly?' }</p>
                    <button className='create-new-user' onClick={() => setIsSignUpActive( true )}>{ 'Create your Shop Swiftly account' }</button>
                </div>
            </div> : <SignUp isSignUpActive={ true } setIsSignUpActive={ setIsSignUpActive } setIsSignInActive={ setIsSignInActive }/> }
        </>
    )
}

/**
 * Products View
 * 
 * @since 1.0.0
 */
export const GridView = () => {
    const [ posts, setPosts ] = useState([])
    const { getTheDate, getCategory } = usePostRelatedHooks()
    const [ currentPage, setCurrentPage ] = useState( 1 )
    const productsPerPage = 15

    useEffect(() => {
        fetchFunction({
            action: 'query',
            setterFunction: setPosts,
            query: `SELECT * FROM swt_posts WHERE post_status!='trash'`
        })
    }, [])

    /* Total number of pages */
    const totalPages = useMemo(() => {
        if( posts.length > 0 ) {
            let test = posts.length / productsPerPage
            if( test > 0 ) return Math.round( test )
        }
        return 0;
    }, [ posts ])

    /* Handle Previous Click */
    const handlePreviousClick = () => {
        if( currentPage > 1 ) setCurrentPage( currentPage - 1 )
    }

    /* Handle Next Click */
    const handleNextClick = () => {
        if( currentPage <= totalPages ) setCurrentPage( currentPage + 1 )
    }

    /* Pagination products */
    const paginationProducts = useMemo(() => {
        if( posts.length > 0 ) {
            let from = productsPerPage * ( currentPage - 1 )
            let to = productsPerPage * currentPage
            return posts.slice( from, to )
        }
        return []
    }, [ currentPage, posts ])

    return <SectionWrapper main="grid-view-wrapper">
        { paginationProducts.length > 0 && <div className='grid-view-main'>
            <div className='section-details'>
                <h2 className='section-header'>{ '# Recently Added #' }</h2>
            </div>
            <div className='articles-wrapper'>
                {
                    paginationProducts.map(( post, index ) => {
                        const { post_id, post_image: image, post_title: title, post_date: date, post_excerpt: excerpt, post_category: categories, post_status: status } = post
                        if( status !== 'publish' ) return
                        let newCategories = getCategory( categories )
                        return <article className='post' key={ index }>
                            { ( image !== undefined || image !== null ) && <figure className='thumbnail-wrapper'>
                                <img src={ image } className='post-thumbnail'/>
                            </figure> }
                            <div className='post-elements'>
                                { title && <h2 className='post-title'><Link to='/single' state={{ ID: post_id }}>{ title }</Link></h2> }
                                <div className='post-meta'>
                                    { date && <span className='post-date'>{ getTheDate( date ) }</span> }
                                    <ul className='post-categories'>
                                        {
                                            newCategories?.map(( cat, index ) => (
                                                <li className='cat-item' key={ index }>{ cat }</li>
                                            ))
                                        }
                                    </ul>
                                </div>
                                { excerpt && <p className='post-excerpt'>{ excerpt.split(" ").slice(0, 10).join(" ") + "..." }</p> }
                            </div>
                        </article>
                    })
                }
            </div>
            { totalPages >= 1 && <div className='pagination-wrapper'>
                { <button className="pagination grid-prev" onClick={ handlePreviousClick }>{ 'Previous' }</button> }
                { <button className="pagination grid-next" onClick={ handleNextClick }>{ 'Next' }</button> }
            </div> }
        </div> }
    </SectionWrapper>
} 

export const YouTube = () => {
    const { keyValuePairs } = useOptions()
    const apiKey = ( keyValuePairs['api_key'] !== undefined ? keyValuePairs['api_key'] : '' )
    const youtubeUrl = ( keyValuePairs['youtube_urls'] !== undefined ? keyValuePairs['youtube_urls'].split(',') : [] )
    const [ videos, setVideos ] = useState([])
    const [ activeVideo, setActiveVideo ] = useState('')
    const [ autoplay, setAutoplay ] = useState( 0 )

    /**
     * Get url unique id
     * 
     * @since 1.0.0
     */
    const uniqueUrlIds = useMemo(() => {
        if( youtubeUrl.length > 0 ) {
            return youtubeUrl.reduce(( newValue, url ) => {
                const parsedUrl = new URL( url )
                const { searchParams } = parsedUrl
                const videoId = searchParams.get('v')
                newValue = [ ...newValue, videoId ]
                return newValue
            }, [])
        }
        return []
    }, [ youtubeUrl ])

    /**
     * Use api to fetch video information
     * 
     * @since 1.0.0
     */
    useEffect(() => {
        const api_url = "https://www.googleapis.com/youtube/v3/videos?id=" + uniqueUrlIds.join(',') + "&key=" + apiKey + "&part=snippet,contentDetails";
        fetch( api_url ).then( response => response.json() ).then( data => setVideos( data.items ) )
        setActiveVideo( uniqueUrlIds[0] )
    }, [ apiKey ])

    /**
     * Active video details
     * 
     * @since 1.0.0
     */
    const activeVideoDetails = useMemo(() => {
        let videoDetails = videos?.filter(( video ) => video.id === activeVideo )
        if( videoDetails !== undefined ) return videoDetails[0]
        return []
    }, [ activeVideo ])

    /**
     * Handle new video click
     * 
     * @since 1.0.0
     */
    const handleNewVideoClick = ( props ) => {
        const { id } = props
        setActiveVideo( id )
        setAutoplay( 1 )
    }

    return <SectionWrapper main='swt-youtube'>
        <div className='youtube-wrapper'>
            <div className='active-player'>
                <iframe width="560" height="315" src={ "https://www.youtube.com/embed/" + activeVideo + "?enablejsapi=1&mute=1&autoplay=" + autoplay } frameBorder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                <h2></h2>
            </div>
            <div className='active-player-info'>
                <h2 className='video-title'></h2>
                <span className='channel-title'></span>
            </div>
            <ul className="playlist-wrapper">
                {
                    videos && videos.map(( video, index ) => {
                        const { id, snippet } = video
                        const { thumbnails, title, channelTitle } = snippet
                        if( activeVideo !== id ) {
                            return <li className='video' key={ index } onClick={() => handleNewVideoClick({ id })}>
                                <figure className='thumb-wrapper'>
                                    <img src={ thumbnails.medium.url } alt={ title }/>
                                </figure>
                                <div className='video-info'>
                                    <h2 className='video-title'>{ title }</h2>
                                    <span className='channel-title'>{ channelTitle }</span>
                                </div>
                            </li>
                        }
                    })
                }
            </ul>
        </div>
    </SectionWrapper>
}