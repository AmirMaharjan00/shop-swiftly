import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

export default function AdminLogin() {
    const [ rawInputs, setRawInputs ] = useState({})
    const [ validatedInputs, setValidatedInputs ] = useState({})
    const [ formErrors, setFormErrors ] = useState({})
    const [ isSubmit, setIsSubmit ] = useState( false )

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
        } else {
            event.preventDefault()
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
            {/* <pre>{ JSON.stringify( rawInputs, undefined, 2 ) }</pre> */}
            <form onSubmit={ handleOnSubmit } action='/swt-admin' method='get'>
                <h2 className='title'>Login</h2>
                <p className='form-field'>
                    <span className='label-error-wrap'>
                        <label htmlFor='admin_username'>Username</label>
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