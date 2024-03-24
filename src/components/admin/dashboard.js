import React from 'react'
import { Link, Outlet } from 'react-router-dom';
import './assets/css/admin.css'

export default function Admin() {
    return (
        <>
            <div className='swt-dashboard' id='swt-dashboard'>
                <Sidebar/>
                <div className='swt-admin-main'>
                    <Outlet/>
                </div>
            </div>
        </>
    );
}

const Sidebar = () => {
    let sidebarItemsArray = [ 
        { 'label': 'dashboard', 'link': '/swt-admin' },
        { 'label': 'products', 'link': '/swt-admin/products' },
        { 'label': 'media', 'link': '/swt-admin/media' },
        { 'label': 'pages', 'link': '/swt-admin/pages' },
        { 'label': 'users', 'link': '/swt-admin/users' },
        { 'label': 'settings', 'link': '/swt-admin/settings' }
    ]
    return (
        <>
            <div className='swt-admin-sidebar'>
                <div className='sidebar-head'>
                    <h2 className='title'>Shop Swiftly</h2>
                    <span>Burger Icon</span>
                </div>
                <div className='sidebar-body'>
                    <ul className='sidebar-items'>
                        { sidebarItemsArray.map(( element, index ) =>{ 
                            return ( <Link to={element.link} key={ index }><li className='sidebar-item'>{ element.label.charAt(0).toUpperCase() + element.label.slice(1) }</li></Link> )
                        }) }
                    </ul>
                </div>
            </div>
        </>
    );
}

export const Dashboard = () => {
    return (
        <>
            <h2>Dashboard</h2>
            <Link to='/'>Visit Website</Link>
        </>
    );
}