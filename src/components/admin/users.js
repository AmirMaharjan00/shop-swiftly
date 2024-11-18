import React, { useState, useEffect, useCallback } from 'react'
import { fetchFunction } from '../content/functions'
import { usePostRelatedHooks } from '../content/inc/hooks'

export default function Users ( props ) {
    const [ allUsers, setAllUsers ] = useState( props.registeredUsers )
    const [ activeStatus, setActiveStatus ] = useState( 'all' )
    const [ tempUsers, setTempUsers ] = useState([]);
    const [ searchKey, setSearchKey ] = useState( '' )
    const { getTheDate } = usePostRelatedHooks()

    /** Load data from database */
    useEffect(() => {
        fetchFunction({
            action: 'select',
            tableIdentity: 'user',
            setterFunction: setAllUsers
        })
    }, [])

    /** Set temporary data on status change and all users change */
    useEffect(() => {
        setTempUsers( getFilteredUsers( 'status' ) )
    }, [ allUsers, activeStatus ])

    /** Set temporary data on search key change */
    useEffect(() => {
        setActiveStatus( 'all' )
        setTempUsers( getFilteredUsers( 'search' ) )
    }, [ searchKey ])

    /**
     * Get filtered users
     * 
     * @since 1.0.0
     */
    const getFilteredUsers = useCallback(( action = '' ) => {
        if( allUsers.length > 0 ) {
            if( action === 'search' ) {
                return allUsers.filter( user => { return user.user_name.toLowerCase().includes( searchKey.toLowerCase() ) } )
            } else {
                if( activeStatus === 'all' ) return allUsers
                return allUsers.reduce(( newValue, user ) => {
                    const { user_role: role } = user
                    switch( activeStatus ) {
                        case 'admin':
                                if( role.toLowerCase() === 'admin' ) newValue = [ ...newValue, user ]
                            break;
                        case 'subscriber':
                                if( role.toLowerCase() === 'subscriber' ) newValue = [ ...newValue, user ]
                            break;
                    }
                    return newValue
                }, [])
            }
        } else {
            return []
        }
    }, [ allUsers, activeStatus, searchKey ])

    let currentTime = new Date().toLocaleString()

    let statusItems = [
        {'label': 'all'},
        {'label': 'admin'},
        {'label': 'subscriber'}
    ]

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
                        <input type='search' placeholder='Search . . .' onChange={( event ) => setSearchKey( event.target.value )}/>
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
                                const { user_name: name, user_email: email, user_role: role, registered_date: date } = current
                                return(
                                    <tr className='users-element users-table-body' key={ index }>
                                        <td className='body-item'>{ index + 1 }</td>
                                        <td className='body-item'>{ name }</td>
                                        <td className='body-item'>{ email }</td>
                                        <td className='body-item'>{ role.charAt( 0 ).toUpperCase() + role.slice( 1 ) }</td>
                                        <td className='body-item'>{ getTheDate( date ) }</td>
                                        <td className='body-item action-item'>
                                            <div className='actions-wrapper'>
                                                {/* onClick={() => handleEditorActions( 'update', ID ) } */}
                                                <button className='action edit' >{ 'Edit' }</button>
                                                {/* onClick={() => handleTrashButtonClick( ID, index ) } */}
                                                <button className='action trash' >{ 'Trash' }</button>
                                            </div>
                                        </td>
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