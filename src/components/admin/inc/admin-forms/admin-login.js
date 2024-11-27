import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useUsers } from '../../../content/inc/hooks'
import { HOMECONTEXT } from '../../../../App'

export default function AdminLogin() {
    const [ email, setEmail ] = useState( '' )
    const [ password, setPassword ] = useState( '' )
    const [ emailError, setEmailError ] = useState( '*' )
    const [ passwordError, setPasswordError ] = useState( '*' )
    const navigate = useNavigate()
    const { users } = useUsers()
    const [ userData, setUserData ] = useState({})
    const [ okToStartSession, setOkToStartSession ] = useState( false )
    const { user_id: userID, user_email: retrievedEmail, user_password: retrievedPassword, user_role } = userData
    const homeContext = useContext( HOMECONTEXT )
    const { setIsAdmin } = homeContext

    /**
     * Match retrieved values with entered values and grant permission to start session
     * 
     * @since 1.0.0
     */
    useEffect(() => {
        if( Object.keys( userData ).length > 0 ) {
            if( email === retrievedEmail && password === retrievedPassword ) {
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

    // on login button click
    const handleOnSubmit = ( event ) => {
        event.preventDefault()
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

    return (
        <div className='swt-admin-login' id='swt-admin-login'>
            <form onSubmit={ handleOnSubmit }>
                <h2 className='title'>{ 'Login' }</h2>
                <p className='form-field'>
                    <label htmlFor='admin_username'>
                        <span className='form-label'>{ 'Email' }</span>
                        <span className='form-required'>{ emailError }</span>
                    </label>
                    <input type='email' name='admin_username' id='admin_username' onChange={( event ) => setEmail( event.target.value )} value={ email } />
                </p>
                <p className='form-field'>
                    <label htmlFor='admin_password'>
                        <span className='form-label'>{ 'Password' }</span>
                        <span className='form-required'>{ passwordError }</span>
                    </label>
                    <input type='password' name='admin_password' id='admin_password' onChange={( event ) => setPassword( event.target.value )} value={ password } />
                </p>
                <p className='form-field form-button'>
                    <input type='submit' value='LOGIN' name='admin-login' />
                </p>
                <p className='form-field forgot-password'>
                    <Link to='/swt-admin/swt-forgot-password'>{ 'Forgot password ?' }</Link>
                </p>
                <p className='form-field register-new-admin'>
                    <Link to='/swt-admin/swt-registration'>{ 'Register a new admin' }</Link>
                </p>
            </form>
        </div>
    );
}