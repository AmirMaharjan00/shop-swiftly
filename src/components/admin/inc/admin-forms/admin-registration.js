import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminRegistration() {
    const [ username, setUsername ] = useState( '' )
    const [ password, setPassword ] = useState( '' )
    const [ email, setEmail ] = useState( '' )
    const [ isRegistered, setIsRegistered ] = useState( false )
    const navigate = useNavigate()

    useEffect(() => {
        if( isRegistered ) navigate( '/swt-admin/login' )
    }, [ isRegistered ])

    /**
     * Handle submitting registration form
     * 
     * @since 1.0.0
     */
    const handleRegistrationFormSubmit = ( event ) => {
        const FORMDATA = new FormData()
        FORMDATA.append( 'action', 'insert' )
        FORMDATA.append( 'table_identity', 'user' )
        FORMDATA.append( 'post_type', 'user' )
        FORMDATA.append( 'user_name', username )
        FORMDATA.append( 'user_password', password )
        FORMDATA.append( 'user_email', email )
        FORMDATA.append( 'user_role', 'admin' )
        FORMDATA.append( 'registered_date', Date.now() )
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', {
            method: 'POST',
            body: FORMDATA
        })
        .then(( result ) => result.json())
        .then(( data ) => setIsRegistered( data.length > 0 ? true : false ))
        event.preventDefault()
    }

    return(
        <div className='swt-admin-registration' id='swt-admin-registration'>
            <h2 className='title'>{ 'Registration' }</h2>
            <form onSubmit={ handleRegistrationFormSubmit }>
                <p className='form-field'>
                    <label htmlFor='admin-registration-username'>{ 'Username' }</label>
                    <input type='text' name='admin-registration-username' id='admin-registration-username' value={ username } onChange={( event ) => setUsername( event.target.value )}/>
                </p>
                <p className='form-field'>
                    <label htmlFor='admin-registration-password'>{ 'Password' }</label>
                    <input type='text' name='admin-registration-password' id='admin-registration-password' value={ password } onChange={( event ) => setPassword( event.target.value )} />
                </p>
                <p className='form-field'>
                    <label htmlFor='admin-registration-email'>{ 'Email' }</label>
                    <input type='email' name='admin-registration-email' id='admin-registration-email' value={ email } onChange={( event ) => setEmail( event.target.value )} />
                </p>
                <p className='form-field form-button'>
                    <button>{ 'Register' }</button>
                </p>
            </form>
        </div>
    );
}