import { useState, useEffect } from 'react'
import { useSession, useUsers } from '../content/inc/hooks'

export const SubscriberSetting = () => {
    const { userId } = useSession()
    const { getUserName, getUserEmail, getUserPassword } = useUsers()
    const [ name, setName ] = useState( '' )
    const [ userName, setUserName ] = useState( '' )
    const [ password, setPassword ] = useState( '' )
    const [ isSuccess, setIsSuccess ] = useState( false )
    const [ hasChanged, setHasChanged ] = useState( false )

    useEffect(() => {
        setName( getUserName( userId ) )
        setUserName( getUserEmail( userId ) )
        setPassword( getUserPassword( userId ) )
    }, [ getUserName( userId ), getUserEmail( userId ), getUserPassword( userId ) ])

    useEffect(() => {
        if( isSuccess ) {
            setTimeout(() => {
                setIsSuccess( false )
            }, 1500); // 3 seconds
        }
    }, [ isSuccess ])

    /**
     * Handle Form submit
     * 
     * @since 1.0.0
     */
    const handleFormSubmit = ( event ) => {
        const FORMDATA = new FormData()
        FORMDATA.append( 'action', 'update' )
        FORMDATA.append( 'table_identity', 'user' )
        FORMDATA.append( 'post', userId )
        FORMDATA.append( 'user_name', name )
        FORMDATA.append( 'user_password', password )
        FORMDATA.append( 'user_email', userName )
        FORMDATA.append( 'user_role', 'subscriber' )
        FORMDATA.append( 'registered_date', Date.now() )
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', {
            method: 'POST',
            body: FORMDATA
        })
        .then(( result ) => result.json())
        .then(( data ) => {
            if( 'result' in data ) {
                setIsSuccess( false )
                setHasChanged( false )
            } else {
                setIsSuccess( true )
                setHasChanged( false )
            }
        })
        event.preventDefault()
    }

    /**
     * Handle name change
     */
    const handleNameChange = ( event ) => {
        setName( event.target.value )
        setHasChanged( true )
    }

    /**
     * Handle username change
     */
    const handleUserNameChange = ( event ) => {
        setUserName( event.target.value )
        setHasChanged( true )
    }

    /**
     * Handle password change
     */
    const handlePasswordChange = ( event ) => {
        setPassword( event.target.value )
        setHasChanged( true )
    }

    return <div className='user-settings-page' id="user-settings-page">
        <h2 className='title'>{ 'Change your profile' }</h2>
        <form className='user-form' onSubmit={ handleFormSubmit }>
            <div className='form-field'>
                <label className='form-label-wrapper'>
                    <span className='form-label'>{ 'Name ' }</span>
                    <span className='required-indicator'>{ '*' }</span>
                </label>
                <input type='text' value={ name || '' } onChange={ handleNameChange } required/>
            </div>
            <div className='form-field'>
                <label className='form-label-wrapper'>
                    <span className='form-label'>{ 'Email / Number ' }</span>
                    <span className='required-indicator'>{ '*' }</span>
                </label>
                <input type='text' value={ userName || '' } onChange={ handleUserNameChange } required/>
            </div>
            <div className='form-field'>
                <label className='form-label-wrapper'>
                    <span className='form-label'>{ 'Password ' }</span>
                    <span className='required-indicator'>{ '*' }</span>
                </label>
                <input type='text' value={ password || '' } onChange={ handlePasswordChange } required/>
            </div>
            <div className='form-field'>
                <input type="submit" value={ 'Save' } disabled={ ! hasChanged } className={ 'add-user-button' + ( ! hasChanged ? ' is-disabled' : '' ) } />
            </div>
        </form>
        <SuccessPopup />
    </div>
}

/**
 * Success popup
 * 
 * @since 1.0.0
 */
const SuccessPopup = () => {
    return <div className='subscriber-update-success-popup'>
        <div>{ 'Changed Successfully.' }</div>
    </div>
}