import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '../../../content/inc/hooks'
import { HOMECONTEXT } from '../../../../App'

export default function AdminLogin() {
    const [ rawInputs, setRawInputs ] = useState({})
    const [ validatedInputs, setValidatedInputs ] = useState({})
    const [ formErrors, setFormErrors ] = useState({})
    const [ isSubmit, setIsSubmit ] = useState( false )
    const navigate = useNavigate()
    const { posts: users } = useQuery( 'user' )
    const [ userData, setUserData ] = useState({})
    const [ okToStartSession, setOkToStartSession ] = useState( false )
    const { user_id: userID, user_email: retrievedEmail, user_password: retrievedPassword } = userData
    const { admin_username: adminUsername, admin_password: adminPassword } = validatedInputs
    const homeContext = useContext( HOMECONTEXT )
    const { setIsAdmin } = homeContext

    /**
     * Match retrieved values with entered values and grant permission to start session
     * 
     * @since 1.0.0
     */
    useEffect(() => {
        if( Object.keys( userData ).length > 0 ) {
            if( adminUsername === retrievedEmail && adminPassword === retrievedPassword ) {
                const { user_role } = userData
                setOkToStartSession( true )
                if( user_role === 'admin' ) setIsAdmin( true )
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
            navigate( '/swt-admin' )
        }
    }, [ okToStartSession ])

    // on input field change
    const handleOnChange = ( event ) => {
        let name = event.target.name
        let value = event.target.value
        setRawInputs( values => ({ ...values, [name]:value }) )
    }

    // on login button click
    const handleOnSubmit = ( event ) => {
        setFormErrors( formValidate( rawInputs ) )
        if( Object.keys( formValidate( rawInputs ) ).length === 0 ) {
            setValidatedInputs( rawInputs )
            const { admin_username, admin_password } = rawInputs
            let whereClause = 'user_password="' + admin_password + '" AND ' + 'user_email="' + admin_username + '"'
            const FORMDATA = new FormData()
            FORMDATA.append( 'action', 'select_where' )
            FORMDATA.append( 'table_identity', 'user' )
            FORMDATA.append( 'where_clause', whereClause )
            fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', {
                method: 'POST',
                body: FORMDATA
            })
            .then(( response ) => response.json() )
            .then(( data ) => setUserData( data )) 
            event.preventDefault()
        } else {
            event.preventDefault()
        }
    }

    /**
     * Check if user is admin and is valid 
     * 
     * @since 1.0.0
     */
    const isValidUser = ( users, loginInfo ) => {
        if( users.length > 0 ) {
            const { admin_password: password, admin_username: username } = loginInfo
            users.forEach(( user ) => {
                const { user_email: email, user_password: userPassword } = user
                if( ( password === userPassword ) && ( username === email ) ) return true
            })
            return false
        } else {
            return false
        }
    }

    const formValidate = ( values ) => {
        const error = {}
        if( ! values.admin_username ) error.admin_username = 'Username is required'
        if( ! values.admin_password ) error.admin_password = 'Password is required'
        return error
    }

    return (
        <div className='swt-admin-login' id='swt-admin-login'>
            <form onSubmit={ handleOnSubmit } method="get">
                <h2 className='title'>Login</h2>
                <p className='form-field'>
                    <span className='label-error-wrap'>
                        <label htmlFor='admin_username'>{ 'Email / Phone Number' }</label>
                        <span className='error-message'>{ ( formErrors.admin_username || '' ) + ' *' }</span>
                    </span>
                    <input type='text' name='admin_username' id='admin_username' onChange={ handleOnChange } value={ rawInputs.admin_username || '' } />
                </p>
                <p className='form-field'>
                    <span className='label-error-wrap'>
                        <label htmlFor='admin_password'>Password</label>
                        <span className='error-message'>{ ( formErrors.admin_password || '' ) + ' *' }</span>
                    </span>
                    <input type='text' name='admin_password' id='admin_password' onChange={ handleOnChange } value={ rawInputs.admin_password || '' } />
                </p>
                <p className='form-field form-button'>
                    <input type='submit' value='LOGIN' name='admin-login' />
                </p>
                <p className='form-field forgot-password'>
                    <Link to='/swt-admin/swt-forgot-password'>Forgot password ?</Link>
                </p>
                <p className='form-field register-new-admin'>
                    <Link to='/swt-admin/swt-registration'>Register a new admin</Link>
                </p>
            </form>
        </div>
    );
}