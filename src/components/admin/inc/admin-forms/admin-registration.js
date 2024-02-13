import React from 'react'
import { Link } from 'react-router-dom'

export default function AdminRegistration() {
    return(
        <div className='swt-admin-registration' id='swt-admin-registration'>
            <h2 className='title'>Registration</h2>
            <p className='form-field'>
                <label htmlFor='admin-registration-username'>Username</label>
                <input type='text' name='admin-registration-username' id='admin-registration-username' />
            </p>
            <p className='form-field'>
                <label htmlFor='admin-registration-password'>Password</label>
                <input type='text' name='admin-registration-password' id='admin-registration-password' />
            </p>
            <p className='form-field'>
                <label htmlFor='admin-registration-email'>Email</label>
                <input type='text' name='admin-registration-email' id='admin-registration-email' />
            </p>
            <p className='form-field form-button'>
                <button>
                    <Link to='/swt-admin/login'>Register</Link>
                </button>
            </p>
        </div>
    );
}