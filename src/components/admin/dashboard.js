import React, { useState, useEffect, createContext, useContext } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './assets/css/admin.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSession } from '../content/inc/hooks'
import { faBars, faGauge, faPhotoFilm, faFile, faUserTie, faGear, faThumbtack, faFilePdf } from '@fortawesome/free-solid-svg-icons'
export const ADMINCONTEXT = createContext()

export default function Admin() {
    const { loggedIn } = useSession()
    const navigate = useNavigate()
    const [ overlay, setOverlay ] = useState( false )
    const [ userEditor, setUserEditor ] = useState( false )
    const [ userTrash, setUserTrash ] = useState( false )

    const contextObject = {
        setOverlay,
        overlay,
        setUserEditor,
        userEditor,
        setUserTrash,
        userTrash
      }

    useEffect(() => {
        if( ! loggedIn ) navigate( '/swt-admin/login' )
    }, [])

    return <ADMINCONTEXT.Provider value={ contextObject }>
        <EditorOverlay />
        <div className='swt-dashboard' id='swt-dashboard'>
            <Sidebar/>
            <div className='swt-admin-main'>
                <Outlet/>
            </div>
        </div>
    </ADMINCONTEXT.Provider>
}

const Sidebar = () => {
    const [ canvasActive, setCanvasActive ] = useState( false )
    const [ activePage, setActivePage ] = useState( 0 )
    let sidebarItemsArray = [ 
        { 'label': 'dashboard', 'link': '/swt-admin', 'icon': faGauge },
        { 'label': 'products', 'link': '/swt-admin/products', 'icon': faThumbtack },
        { 'label': 'media', 'link': '/swt-admin/media', 'icon': faPhotoFilm },
        { 'label': 'pages', 'link': '/swt-admin/pages', 'icon': faFile },
        { 'label': 'users', 'link': '/swt-admin/users', 'icon': faUserTie },
        { 'label': 'settings', 'link': '/swt-admin/settings', 'icon': faGear },
        { 'label': 'report', 'link': '/swt-admin/report', 'icon': faFilePdf }
    ]

    return  <div className={ 'swt-admin-sidebar' + ( canvasActive ? ' active' : '' ) }>
        <div className='sidebar-head'>
            { ! canvasActive && <h2 className='title'>{ 'Shop Swiftly' }</h2> }
            <FontAwesomeIcon
                icon = { faBars } 
                className = 'off-canvas'
                onClick = {() => setCanvasActive( ! canvasActive ) }
            />
        </div>
        <div className='sidebar-body'>
            <ul className='sidebar-items'>
                { sidebarItemsArray.map(( element, index ) =>{ 
                    return ( 
                        <Link to={element.link} key={ index } className={ 'sidebar-item-wrapper' + ( activePage == index ? ' active' : '' )} onClick={() => setActivePage( index ) }>
                            <li className='sidebar-item'>
                                <FontAwesomeIcon
                                    icon = { element.icon } 
                                    className = 'off-canvas'
                                />
                                { ! canvasActive && <span className='menu-label'>{ element.label.charAt(0).toUpperCase() + element.label.slice(1) }</span> }
                            </li>
                        </Link>
                    )
                }) }
            </ul>
        </div>
    </div>
}

export const Dashboard = () => {
    return (
        <>
            <h2>Dashboard</h2>
            <Link to='/' target='_blank'>Visit Website</Link>
        </>
    );
}

/**
 * Overlay
 * 
 * @since 1.0.0
 */
export const EditorOverlay = () => {
    const adminContext = useContext( ADMINCONTEXT )
    const { overlay, setOverlay, setUserEditor, setUserTrash } = adminContext
    const CLASS = 'full-page-overlay' + ( overlay ? ' active' : '' ) 

    /**
     * Handle overlay click
     * 
     * @since 1.0.0
     */
    const handleClick = () => {
        setOverlay( false )
        setUserEditor( false )
        setUserTrash( false )
    }
    return <div className={ CLASS } onClick={ handleClick }></div>
}