import React from 'react'
import { Link } from 'react-router-dom'

export default function AdminForgotPassword() {
    return(
        <div className='swt-admin-forgot-password' id='swt-admin-forgot-password'>
            <h2 className='title'>Change Password</h2>
            <p className='form-field'>
                <label htmlFor='admin-old-password'>Old Password</label>
                <input type='text' name='admin-old-password' id='admin-old-password' />
            </p>
            <p className='form-field'>
                <label htmlFor='admin-new-password'>New Password</label>
                <input type='text' name='admin-new-password' id='admin-new-password' />
            </p>
            <p className='form-field'>
                <label htmlFor='admin-confirm-password'>Confirm Password</label>
                <input type='text' name='admin-confirm-password' id='admin-confirm-password' />
            </p>
            <p className='form-field form-button'>
                <button>
                    <Link to='/swt-admin/login'>Change Password</Link>
                </button>
            </p>
        </div>
    );
}