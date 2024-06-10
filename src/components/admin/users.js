import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

export default function Users ( props ) {
    const [ allUsers, setAllUsers ] = useState( props.registeredUsers )
    const [ activeStatus, setActiveStatus ] = useState( 'all' )
    const [ tempUsers, setTempUsers ] = useState([]);

    useEffect(() => {
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php?swt_users=get_table_data' )
        .then( result => result.json() )
        .then( data => setAllUsers( data ) )
    }, [])

    useEffect(() => {
        setTempUsers( allUsers )
    }, [ allUsers ])

    let currentTime = new Date().toLocaleString()

    let statusItems = [
        {'label': 'all'},
        {'label': 'admin'},
        {'label': 'subscriber'}
    ]

    /**
     * 
     */
    const updateUsersWithSearch = ( searchKey ) => {
        if( searchKey == '' ) {
            setTempUsers( allUsers )
            return
        }
        let productTitles = tempUsers.filter( current => { return current.user_name.toLowerCase().includes( searchKey.toLowerCase() ) } )
        // console.log( tempUsers )
        setTempUsers( productTitles )
    }
    return (
        <>
            <div className='status-time-wrap'>
                <div className='page-head'>
                    <h2 className='page-title'>Users</h2>
                    <span>{ currentTime }</span>
                </div>
                <div className='date-search-wrap'>
                    <nav className='status-list'>
                        {
                            statusItems.map(( element, index ) => { 
                                var _thisClass = 'status-item'
                                if( element.label == activeStatus ) _thisClass += ' active'
                                return <span
                                    key={ index }
                                    className={ _thisClass }
                                    onClick={() => setActiveStatus( element.label ) }
                                >
                                    { element.label.charAt(0).toUpperCase() + element.label.slice(1) }
                                </span>
                            })
                        }  
                    </nav>
                    <label>
                        <input type='search' placeholder='Search . . .' onChange={( event ) => updateUsersWithSearch( event.target.value )}/>
                        <input type='submit' value='Search'/>
                    </label>
                </div>
            </div>
            <table className='users-wrap'>
                <thead>
                    <tr className='users-element users-table-head'>
                        <th className='head-item'>Sno</th>
                        <th className='head-item'>Username</th>
                        <th className='head-item'>Email</th>
                        <th className='head-item'>Role</th>
                        <th className='head-item'>Registered Date</th>
                        <th className='head-item'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        ( tempUsers.length > 0 ) ? tempUsers.map(( current, index ) => {
                                return(
                                    <tr className='users-element users-table-body' key={ index }>
                                        <td className='body-item'>{ index + 1 }</td>
                                        <td className='body-item'>{ current['user_name'] }</td>
                                        <td className='body-item'>{ current['user_email'] }</td>
                                        <td className='body-item'>{ current['user_role'] }</td>
                                        <td className='body-item'>{ current['registered_date'] }</td>
                                        <td className='body-item'><FontAwesomeIcon icon={ faEllipsisVertical } /></td>
                                    </tr>
                                ); 
                            })
                        : <tr className='users-element users-table-body no-users'><td className='body-item' colSpan={8}>No Users</td></tr> 
                    }
                </tbody>
            </table>
        </>
    );
}