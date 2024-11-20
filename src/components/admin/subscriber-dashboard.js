import React, { useState, useEffect, createContext, useContext, useMemo } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './assets/css/admin.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSession, useOrders, useUsers, usePostRelatedHooks } from '../content/inc/hooks'
import { faBars, faGauge, faGear, faThumbtack } from '@fortawesome/free-solid-svg-icons'
import { Doughnut, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { ChartBackgroundColrs, ChartBorderColors } from './functions';
import { fetchFunction } from '../content/functions';

export const SUBSCRIBERCONTEXT = createContext()

export function Subscriber() {
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
        if( ! loggedIn ) navigate( '/' )
    }, [])

    return <SUBSCRIBERCONTEXT.Provider value={ contextObject }>
        <EditorOverlay />
        <div className='swt-dashboard' id='swt-dashboard'>
            <Sidebar/>
            <div className='swt-admin-main'>
                <Outlet/>
            </div>
        </div>
    </SUBSCRIBERCONTEXT.Provider>
}

const Sidebar = () => {
    const [ canvasActive, setCanvasActive ] = useState( false )
    const [ activePage, setActivePage ] = useState( 0 )
    let sidebarItemsArray = [ 
        { 'label': 'dashboard', 'link': '/swt-user', 'icon': faGauge },
        { 'label': 'Reports', 'link': '/swt-user/report', 'icon': faThumbtack },
        { 'label': 'settings', 'link': '/swt-user/setting', 'icon': faGear },
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

export const SubscriberDashboard = () => {
    const { getUserOrders } = useOrders()
    const { getUserName } = useUsers()
    const { getTheDate } = usePostRelatedHooks()
    const { userId } = useSession()
    const reportData = getUserOrders( userId )

    return  <div className='user-dashboard-page' id="user-dashboard-page">
        <div className='page-header'>
            <div className='page-title-wrapper'>
                <h2 className='title'>{ 'Hello, ' + getUserName( userId ) }</h2>
                <span className='toay-date'>{ 'Today is ' + getTheDate( Date.now() ) }</span>
            </div>
            <Link to='/' target='_blank' className='visit-website'>{ 'Visit Website' }</Link>
        </div>
        <div className="overview-wrapper">
            <div className="overview-item">
                <h2 className='overview-label'>{ 'Total Orders' }</h2>
                <span className='overview-value'>{ reportData.length }</span>
            </div>
            <div className="overview-item">
                <h2 className='overview-label'>{ 'Total Orders' }</h2>
                <span className='overview-value'>{ '1' }</span>
            </div>
            <div className="overview-item">
                <h2 className='overview-label'>{ 'Total Orders' }</h2>
                <span className='overview-value'>{ '1' }</span>
            </div>
        </div>
        <div className='chart-wrapper'>
            <DoughnutChart />
            <PieChart />
        </div>
    </div>
}

/**
 * Overlay
 * 
 * @since 1.0.0
 */
export const EditorOverlay = () => {
    const adminContext = useContext( SUBSCRIBERCONTEXT )
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
 * Create doughnut chart
 * 
 * @since 1.0.0
 */
const DoughnutChart = () => {
    const { userId } = useSession()
    const [ reportData, setReportData ] = useState([])
    ChartJS.register(ArcElement, Tooltip, Legend, Title);

    useEffect(() => {
        fetchFunction({
            action: 'query',
            tableIdentity: 'order',
            setterFunction: setReportData,
            query: `SELECT post_id, post_title, SUM(order_quantity) AS total_quantity FROM swt_posts JOIN swt_orders ON post_id = product_id where user_id=${userId} GROUP BY post_id, post_title ORDER BY total_quantity DESC LIMIT 5`
        })
    }, [])

    /**
     * labels for chart
     * 
     * @since 1.0.0
     */
    const labels = useMemo(() => {
        if( reportData.length > 0 ) {
            return reportData.reduce(( newValue, order ) => {
                let { post_title } = order
                newValue = [ ...newValue, post_title ]
                return newValue
            }, [])
        } else {
            return []
        }
    }, [ reportData ])

    /**
     * labels for chart
     * 
     * @since 1.0.0
     */
    const labelData = useMemo(() => {
        if( reportData.length > 0 ) {
            return reportData.reduce(( newValue, order ) => {
                let { total_quantity } = order
                newValue = [ ...newValue, total_quantity ]
                return newValue
            }, [])
        } else {
            return []
        }
    }, [ reportData ])

    // Define the data for the Doughnut chart
    const data = {
        labels: labels, // Labels for segments
        datasets: [{
            label: 'Dataset 1',
            data: labelData, // Data values for each segment
            backgroundColor: ChartBackgroundColrs,
            borderColor: ChartBorderColors,
            borderWidth: 1 // Border width for each segment
        }],
    };

    // Define chart options
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Top 5 Items Bought',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.raw} units`; // Custom label format
                    },
                },
            },
        },
        cutout: '50%', // This will create the "donut" effect (50% inner radius)
    };

    return (
        <div className='user-doughnut chart'>
            <Doughnut data={data} options={options} />
        </div>
    );
};

/**
 * Create Pie chart
 * 
 * @since 1.0.0
 */
const PieChart = () => {
    const { userId } = useSession()
    const [ reportData, setReportData ] = useState([])
    ChartJS.register(ArcElement, Tooltip, Legend);

    useEffect(() => {
        fetchFunction({
            action: 'query',
            tableIdentity: 'order',
            setterFunction: setReportData,
            query: `SELECT post_title, (order_price * order_quantity) AS total_sales FROM swt_posts join swt_orders ON post_id = product_id where user_id=${userId} ORDER BY total_sales DESC LIMIT 5`
        })
    }, [])

    /**
     * labels for chart
     * 
     * @since 1.0.0
     */
    const labels = useMemo(() => {
        if( reportData.length > 0 ) {
            return reportData.reduce(( newValue, order ) => {
                let { post_title } = order
                newValue = [ ...newValue, post_title ]
                return newValue
            }, [])
        } else {
            return []
        }
    }, [ reportData ])

    /**
     * labels for chart
     * 
     * @since 1.0.0
     */
    const labelData = useMemo(() => {
        if( reportData.length > 0 ) {
            return reportData.reduce(( newValue, order ) => {
                let { total_sales } = order
                newValue = [ ...newValue, total_sales ]
                return newValue
            }, [])
        } else {
            return []
        }
    }, [ reportData ])

    // Define the data for the Doughnut chart
    const data = {
        labels: labels, // Labels for segments
        datasets: [{
            label: 'Dataset 1',
            data: labelData, // Data values for each segment
            backgroundColor: ChartBackgroundColrs,
            // hoverBackgroundColor: ChartBorderColors,
            // hoverOffset: 4,
            borderColor: ChartBorderColors,
            borderWidth: 1 // Border width for each segment
        }],
    };

    // Define chart options
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: '5 Most Expensive Items',
            },
            legend: {
                position: 'top', // Position of the legend
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.raw} units`; // Custom label format
                    },
                },
            },
        },
        // cutout: '50%', // This will create the "donut" effect (50% inner radius)
    };

    return (
        <div className='user-piechart chart'>
            <Pie data={data} options={options} />
        </div>
    );
};
