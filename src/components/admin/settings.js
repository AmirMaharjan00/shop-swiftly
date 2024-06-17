import React, { useState, useEffect } from 'react'

export default function Settings () {
    const [ getKeyValuePair, setKeyValuePair ] = useState([])
    const [ getKey, setKey ] = useState( '' )
    const [ getValue, setValue ] = useState( '' )
    
    const DATABASE = {
        'option_key' : getKey,
        'option_value': getValue
    }

    /**
     * set getKey state
     * 
     * @since 1.0.0
     */
    const updateGetKeyState = ( key ) => {
        setKey( key )
    }

    /**
     * set getValue state
     * 
     * @since 1.0.0
     */
    const updateGetValueState = ( value ) => {
        setValue( value )
    }

    /**
     * Handle save button click
     * 
     * @since 1.0.0
     */
    const handleSaveButtonClick = () => {
        let newPairs =  [ ...getKeyValuePair, DATABASE ]
        setKeyValuePair( newPairs )

        newPairs.map( current => {
            var apiParameters = {
                method: 'POST',
                body: JSON.stringify({
                    'params' : current,
                    'post_type' : 'options'
                })
            }
            fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', apiParameters )
            .then(( result ) => result.json())
            .then( ( data ) => { console.log( data ) } )
        } )
    }

    return (
        <>
            <h2>Settings</h2>
            <ApiDivStructure
                setKey = { updateGetKeyState }
                setValue = { updateGetValueState }
            />
            <button className="save-settings" onClick={ handleSaveButtonClick }>{ 'Save' }</button>
        </>
    );
}

const ApiDivStructure = ({ label, description, placeholder, value, setKey, setValue }) => {
    const [ api, setApi ] = useState( value )
    const [ getOptions, setOptions ] = useState([])

    const KEYID =  label.toLowerCase().trim().replaceAll( ' ', '_' )

    useEffect(() => {
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php?swt_options=get_table_data' )
        .then(( result ) => result.json() )
        .then( ( data ) => setOptions( (data == null) ? [] : data ))
    }, [] )

    useEffect(() => {
        if( getOptions.length > 0 ) {
            let filteredOptions = getOptions.filter( current => {
                return current.option_key == KEYID
            } )
            // console.log( filteredOptions[ filteredOptions.length - 1 ] )
            if( filteredOptions.length > 0 ) setApi( filteredOptions[ filteredOptions.length - 1 ].option_value )
        }
    }, [ getOptions ])

    useEffect(() => {
        setKey( KEYID )
        setValue( api )
    }, [ api ])

    return (
        <div className='api-wrapper'>
            <div className='elements-wrapper'>
                <h2 className='title'>{ label }</h2>
                <p className='description'>{ description }</p>
            </div>
            <div className='api-key-wrapper'>
                <input value={ api } placeholder={ placeholder } id={ KEYID } onChange={ event => setApi( event.target.value ) } />
            </div>
        </div>
    );
}

ApiDivStructure.defaultProps = {
    label: 'YouTube API Key',
    description: 'Insert your api key here to render a video playlist in the website.',
    placeholder: 'AIzaSyC4JZb8vS2hLxxxxxxx_xxxxxxxx_xxxxxxxxx',
    value: '',
    setKey: null,
    setValue: null
}