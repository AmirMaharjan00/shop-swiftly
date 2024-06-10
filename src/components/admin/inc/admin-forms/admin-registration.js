import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function AdminRegistration() {
    const [ registrationForm, setRegistrationForm ] = useState([])
    const [ username, setUsername ] = useState( '' )
    const [ password, setPassword ] = useState( '' )
    const [ email, setEmail ] = useState( '' )
    const [ isRegistered, setIsRegistered ] = useState( false )

    useEffect(() => {
        setRegistrationForm({
        'user_name': username,
            'user_password': password,
            'user_email': email,
            'user_role': 'admin',
            'registered_date': Date.now()
        })
    }, [ username, password, email ])

    /**
     * Handle submitting registration form
     * 
     * @since 1.0.0
     */
    const handleRegistrationFormSubmit = ( event ) => {
        let apiParameters = {
            method: 'POST',
            body: JSON.stringify({
                'params' : registrationForm,
                'post_type' : 'user'
            })
        }
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php?swt_users=get_table_data', apiParameters )
        .then(( result ) => result.json())
        .then( ( data ) => { setIsRegistered( data ? true : false )} )
        event.preventDefault()
    }

    return(
        <div className='swt-admin-registration' id='swt-admin-registration'>
            <h2 className='title'>Registration</h2>
            <form onSubmit={ handleRegistrationFormSubmit }>
                <p className='form-field'>
                    <label htmlFor='admin-registration-username'>Username</label>
                    <input type='text' name='admin-registration-username' id='admin-registration-username' value={ username } onChange={( event ) => setUsername( event.target.value )}/>
                </p>
                <p className='form-field'>
                    <label htmlFor='admin-registration-password'>Password</label>
                    <input type='text' name='admin-registration-password' id='admin-registration-password' value={ password } onChange={( event ) => setPassword( event.target.value )} />
                </p>
                <p className='form-field'>
                    <label htmlFor='admin-registration-email'>Email</label>
                    <input type='email' name='admin-registration-email' id='admin-registration-email' value={ email } onChange={( event ) => setEmail( event.target.value )} />
                </p>
                <p className='form-field form-button'>
                    <button>
                        <Link to='/swt-admin/login'>Register</Link>
                    </button>
                </p>
            </form>
        </div>
    );
}