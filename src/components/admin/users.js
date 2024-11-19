import React, { useState, useEffect, useCallback, useContext, createContext } from 'react'
import { fetchFunction } from '../content/functions'
import { usePostRelatedHooks } from '../content/inc/hooks'
import { ADMINCONTEXT } from './dashboard'
const USERCONTEXT = createContext()

export default function Users ( props ) {
    const [ allUsers, setAllUsers ] = useState( props.registeredUsers )
    const [ fetch, setFetch ] = useState( true )
    const [ userId, setUserId ] = useState( 0 )
    const [ activeStatus, setActiveStatus ] = useState( 'all' )
    const [ tempUsers, setTempUsers ] = useState([]);
    const [ searchKey, setSearchKey ] = useState( '' )
    const [ isUpdate, setIsUpdate ] = useState( false )
    const [ isDeleted, setIsDeleted ] = useState( false )
    const { getTheDate } = usePostRelatedHooks()
    const adminContext = useContext( ADMINCONTEXT )
    const { overlay, setOverlay, setUserEditor, userEditor, setUserTrash, userTrash } = adminContext
    const [ userInfo, setUserInfo ] = useState({
        name: '',
        userName: '',
        password: '',
        role: 'subscriber'
    })
    const userObject = {
        userInfo,
        setUserInfo,
        setIsUpdate,
        isUpdate,
        setFetch,
        setUserEditor,
        setOverlay,
        userId,
        setUserTrash,
        userTrash,
        setIsDeleted,
        isDeleted
    }

    /** Load data from database */
    useEffect(() => {
        if( fetch  ) {
            fetchFunction({
                action: 'select',
                tableIdentity: 'user',
                setterFunction: setAllUsers
            })
            setFetch( false )
        }
    }, [ fetch ])

    /** Refetch data after delete */
    useEffect(() => {
        if( isDeleted ) {
            fetchFunction({
                action: 'select',
                tableIdentity: 'user',
                setterFunction: setAllUsers
            })
            setIsDeleted( false )
        }
    }, [ isDeleted ])

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

    /**
     * Handle add user click
     * 
     * @since 1.0.0
     */
    const handleAddUserClick = () => {
        setUserEditor( ! userEditor )
        setOverlay( ! overlay )
        setIsUpdate( false )
        setUserInfo({
            name: '',
            userName: '',
            password: '',
            role: 'subscriber'
        })
    }

    /**
     * Handle edit button click
     * 
     * @since 1.0.0
     */
    const handleEditButton = ( user ) => {
        setUserEditor( ! userEditor )
        setOverlay( ! overlay )
        setIsUpdate( true )
        let { user_id, user_name: name, user_email: email, user_role: role, user_password: password } = user
        setUserId( user_id )
        setUserInfo({
            name: name,
            userName: email,
            password: password,
            role: role.toLowerCase()
        })
    }

    /**
     * Handle trash button click
     * 
     * @since 1.0.0
     */
    const handleTrashButtonClick = ( user ) => {
        setOverlay( ! overlay )
        setUserTrash( ! userTrash )
        let { user_id } = user
        setUserId( user_id )
    }

    return <USERCONTEXT.Provider value={ userObject }>
        <div className="swt-user-page">
            <button className='add-user' onClick={ handleAddUserClick }>{ 'Add User' }</button>
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
                        ( tempUsers.length > 0 ) ? tempUsers.map(( user, index ) => {
                                const { user_name: name, user_email: email, user_role: role, registered_date: date } = user
                                return(
                                    <tr className='users-element users-table-body' key={ index }>
                                        <td className='body-item'>{ index + 1 }</td>
                                        <td className='body-item'>{ name }</td>
                                        <td className='body-item'>{ email }</td>
                                        <td className='body-item'>{ role.charAt( 0 ).toUpperCase() + role.slice( 1 ) }</td>
                                        <td className='body-item'>{ getTheDate( date ) }</td>
                                        <td className='body-item action-item'>
                                            <div className='actions-wrapper'>
                                                <button className='action edit' onClick={() => handleEditButton( user )}>{ 'Edit' }</button>
                                                <button className='action trash' onClick={() => handleTrashButtonClick( user ) }>{ 'Trash' }</button>
                                            </div>
                                        </td>
                                    </tr>
                                ); 
                            })
                        : <tr className='users-element users-table-body no-users'><td className='body-item' colSpan={8}>No Users</td></tr> 
                    }
                </tbody>
            </table>
            { userEditor && <UserEditor /> }
            { userTrash && <DeleteUser /> }
        </div>
    </USERCONTEXT.Provider>
}

/**
 * Add user
 * 
 * @since 1.0.0
 */
const UserEditor = () => {
    const { userInfo, setUserInfo, isUpdate, setFetch, setUserEditor, setOverlay, userId } = useContext( USERCONTEXT )
    const { name, userName, password, role } = userInfo

    /**
     * Handle form submit
     * 
     * @since 1.0.0
     */
    const handleFormSubmit = ( event ) => {
        const FORMDATA = new FormData()
        FORMDATA.append( 'action', ( isUpdate ) ? 'update' : 'insert' )
        FORMDATA.append( 'table_identity', 'user' )
        if( isUpdate ) {
            FORMDATA.append( 'post', userId )
        } else {
            FORMDATA.append( 'post_type', 'user' )
        }
        FORMDATA.append( 'user_name', name )
        FORMDATA.append( 'user_password', password )
        FORMDATA.append( 'user_email', userName )
        FORMDATA.append( 'user_role', role )
        FORMDATA.append( 'registered_date', Date.now() )
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', {
            method: 'POST',
            body: FORMDATA
        })
        .then(( result ) => result.json())
        setFetch( true )
        setUserEditor( false )
        setOverlay( false )
        event.preventDefault()
    }

    return <div className='user-editor-popup'>
        <form className='user-form' onSubmit={ handleFormSubmit }>
            <div className='form-field'>
                <label className='form-label-wrapper'>
                    <span className='form-label'>{ 'Name ' }</span>
                    <span className='required-indicator'>{ '*' }</span>
                </label>
                <input type='text' value={ name || '' } onChange={( event ) => setUserInfo({ ...userInfo, name: event.target.value })} />
            </div>
            <div className='form-field'>
                <label className='form-label-wrapper'>
                    <span className='form-label'>{ 'Email / Number ' }</span>
                    <span className='required-indicator'>{ '*' }</span>
                </label>
                <input type='text' value={ userName || '' } onChange={( event ) => setUserInfo({ ...userInfo, userName: event.target.value })} />
            </div>
            <div className='form-field'>
                <label className='form-label-wrapper'>
                    <span className='form-label'>{ 'Password ' }</span>
                    <span className='required-indicator'>{ '*' }</span>
                </label>
                <input type='text' value={ password || '' } onChange={( event ) => setUserInfo({ ...userInfo, password: event.target.value })} />
            </div>
            <div className='form-field admin-role'>
                <label className='form-label-wrapper'>
                    <span className='form-label'>{ 'Role : ' }</span>
                </label>
                <div className='radio-wrapper'>
                    <p className='radio-item'>
                        <input type="radio" id="admin" name="role" value="admin" checked={ role === 'admin' } onChange={() => setUserInfo({ ...userInfo, role: 'admin' })} />
                        <label htmlFor="admin">{ 'Admin' }</label>
                    </p>
                    <p className='radio-item'>
                        <input type="radio" id="subscriber" name="role" value="subscriber" checked={ role === 'subscriber' } onChange={() => setUserInfo({ ...userInfo, role: 'subscriber' })} />
                        <label htmlFor="subscriber">{ 'Subscriber' }</label>
                    </p>
                </div>
            </div>
            <div className='form-field'>
                <input type="submit" value={ isUpdate ? 'Save' : 'Add' } className='add-user-button'/>
            </div>
        </form>
    </div>
}

/**
 * Delete user popup
 * 
 * @since 1.0.0
 */
const DeleteUser = () => {
    const { setUserTrash, setOverlay, userId, setIsDeleted } = useContext( USERCONTEXT )

    /**
     * handle no click
     * 
     * @since 1.0.0
     */
    const handleNoClick = () => {
        setUserTrash( false )
        setOverlay( false )
    }

    /**
     * handle yes click
     * 
     * @since 1.0.0
     */
    const handleYesClick = () => {
        setUserTrash( false )
        setOverlay( false )
        fetchFunction({
            action: 'delete',
            tableIdentity: 'user',
            setterFunction: setIsDeleted,
            post: userId
        })
    }

    return <div className='delete-popup-content'>
        <h2 className="title">{ 'Are you sure you want to delete this user ?' }</h2>
        <div className="delete-action-wrapper">
            <button className="action positive" onClick={ handleYesClick }>{ 'Yes' }</button>
            <button className="action negetive" onClick={ handleNoClick }>{ 'No' }</button>
        </div>
    </div>
}