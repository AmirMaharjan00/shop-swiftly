import React, { useState } from 'react'

export default function DatabaseForm() {
    const [ formInfo, setFormInfo ] = useState({
        servername: '',
        username: '',
        password: '',
        database: ''
    })
    // handle form submit
    const handleDatabaseFormSubmit = ( event ) => {

    }

    return (
        <>
            <div className='swt-database-form' id='swt-database-form'>
                <form onSubmit={ handleDatabaseFormSubmit }>
                    <div className='form-item'>
                        <div className='form-title-wrap'>
                            <label htmlFor='db_servername'>Servername</label>
                            <span className='error'>*</span>
                        </div>
                        <input type='text' placeholder='' name='db_servername'/>
                    </div>
                    <div className='form-item'>
                        <div className='form-title-wrap'>
                            <label htmlFor='db_username'>Username</label>
                            <span className='error'>*</span>
                        </div>
                        <input type='text' placeholder='' name='db_username'/>
                    </div>
                    <div className='form-item'>
                        <div className='form-title-wrap'>
                            <label htmlFor='db_password'>Password</label>
                            <span className='error'>*</span>
                        </div>
                        <input type='text' placeholder='' name='db_password'/>
                    </div>
                    <div className='form-item'>
                        <div className='form-title-wrap'>
                            <label htmlFor='db_database_name'>Dataabse Name</label>
                            <span className='error'>*</span>
                        </div>
                        <input type='text' placeholder='' name='db_database_name'/>
                    </div>
                    <input type='submit' value='Submit' />
                </form>
            </div>
        </>
    );
}