import React, { useState, useEffect, createContext, useContext } from 'react'
import { HOMECONTEXT } from '../../App'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './assets/css/admin.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSession, useOrders, useUsers, usePostRelatedHooks, usePosts, usePages } from '../content/inc/hooks'
import { faBars, faGauge, faPhotoFilm, faFile, faUserTie, faGear, faThumbtack, faFilePdf } from '@fortawesome/free-solid-svg-icons'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ChartBackgroundColrs, ChartBorderColors } from './functions';
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
    const { getOrdersViaTime } = useOrders()
    const { getUserName, users } = useUsers()
    const { getTheDate } = usePostRelatedHooks()
    const { userId } = useSession()
    const { getPostViaStatus } = usePosts()
    const { getPageViaStatus } = usePages()
    const data = [ getPostViaStatus().length, getPageViaStatus().length, users.length, getOrdersViaTime().length ]
    const navigate = useNavigate()

     /**
     * Handle Logout
     * 
     * @since 1.0.0
     */
     const handleLogout = () => {
        sessionStorage.clear()
        navigate( '/' )
    }

    return <div className='admin-dashboard-page' id="admin-dashboard-page">
        <div className='page-header'>
            <div className='page-title-wrapper'>
                <h2 className='title'>{ 'Hello, ' + getUserName( userId ) }</h2>
                <span className='toay-date'>{ 'Today is ' + getTheDate( Date.now() ) }</span>
            </div>
            <div>
                <Link to='/' target='_blank' className='visit-website'>{ 'Visit Website' }</Link>
                <button className='dashboard-logout' onClick={ handleLogout }>{ 'Logout' }</button>
            </div>
        </div>
        <div className="overview-wrapper">
            <div className="overview-item">
                <h2 className='overview-label'>{ 'Total Products' }</h2>
                <span className='overview-value'>{ getPostViaStatus().length }</span>
            </div>
            <div className="overview-item">
                <h2 className='overview-label'>{ 'Total Pages' }</h2>
                <span className='overview-value'>{ getPageViaStatus().length }</span>
            </div>
            <div className="overview-item">
                <h2 className='overview-label'>{ 'Total Users' }</h2>
                <span className='overview-value'>{ users.length }</span>
            </div>
            <div className="overview-item">
                <h2 className='overview-label'>{ 'Daily Orders' }</h2>
                <span className='overview-value'>{ getOrdersViaTime().length }</span>
            </div>
        </div>
        <div className='chart-wrapper'>
            <BarChart data={ data }/>
        </div>
    </div>
    
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

/**
 * Create Bar chart
 * 
 * @since 1.0.0
 */
const BarChart = ( props ) => {
    const { data: itemData } = props
    ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend );

    // Define the data for the Doughnut chart
    const data = {
        labels: [ 'Products', 'Pages', 'Users', 'Daily Orders' ],
        datasets: [{
            label: 'Overview',
            data: itemData,
            backgroundColor: ChartBackgroundColrs,
            borderColor: ChartBorderColors,
            borderWidth: 1
        }]
    };

    // Define chart options
    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                beginAtZero: true,  // Start X-axis at zero
            },
            y: {
                beginAtZero: true,  // Start Y-axis at zero
            },
        },
    };

    return (
        <div className='admin-barchart chart'>
            <Bar data={data} options={options} />
        </div>
    );
};