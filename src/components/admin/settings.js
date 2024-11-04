import React, { useState, useEffect, useMemo } from 'react'
import { fetchFunction } from '../content/functions'

export default function Settings () {
    const [ getKeyValuePair, setKeyValuePair ] = useState({
        'api_key': '',
        'youtube_urls': [ '' ]
    })
    const [ options, setOptions ] = useState([])
    const [ keyCollection, setKeyCollection ] = useState([ 'api_key', 'youtube_urls' ])

    useEffect(() => {
        fetchFunction({
            action: 'select',
            tableIdentity: 'options',
            setterFunction: setOptions
        })
    }, [])

    /**
     * Filter options
     * 
     * @since 1.0.0
     */
    const filteredOptions = useMemo(() => {
        return options.reduce(( newValue, option ) => {
            const { option_key: key, option_value: value } = option
            if( keyCollection.includes( key ) ) newValue = { ...newValue, [key]: value }
            return newValue
        }, {})
    }, [ options ])

    useEffect(() => {
        let newKeyValuePair = keyCollection.reduce(( newValue, key ) => {
            if( 'youtube_urls' === key ) {
                if( filteredOptions[key] ) {
                    newValue = { ...newValue, [key]: filteredOptions[key].split(',') }
                } else {
                    newValue = { ...newValue, [key]: getKeyValuePair[key] }
                }
            } else {
                newValue = { ...newValue, [key]: filteredOptions[key] }
            }
            return newValue
        }, {})
        setKeyValuePair( newKeyValuePair )
    }, [ options ])

    /**
     * Handle save button click
     * 
     * @since 1.0.0
     */
    const handleSaveButtonClick = () => {
        Object.entries( getKeyValuePair ).map(([ optionKey, optionValue ]) => {
            const FORMDATA = new FormData()
            FORMDATA.append( 'action', ( optionKey in filteredOptions ) ? 'update' : 'insert' )
            FORMDATA.append( 'table_identity', 'options' )
            if( ( optionKey in filteredOptions ) ) {
                FORMDATA.append( 'post', optionKey )
            } else {
                FORMDATA.append( 'post_type', 'options' )
            }
            FORMDATA.append( 'option_key', optionKey )
            FORMDATA.append( 'option_value', optionValue )
            fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', {
                method: 'POST',
                body: FORMDATA
            })
            .then(( result ) => result.json())
        })
    }

    return (
        <>
            <div className='page-header'>
                <h2>{ 'Settings' }</h2>
                <button className="save-settings" onClick={ handleSaveButtonClick }>{ 'Save' }</button>
            </div>
            <ApiDivStructure
                setOption = { setKeyValuePair }
                getKeyValuePair = { getKeyValuePair }
            />
            <YoutubeRepeater
                setOption = { setKeyValuePair }
                getKeyValuePair = { getKeyValuePair }
            />
        </>
    );
}

const ApiDivStructure = ( props ) => {
    const { label, description, placeholder, getKeyValuePair } = props
    const key = 'api_key'
    const api = getKeyValuePair[ key ]

    /**
     * Handle api key change
     * 
     * @since 1.0.0
     */
    const handleApiKeyChange = ( event ) => {
        let value = event.target.value
        props.setOption({ ...getKeyValuePair, [key]: value })
    }

    return (
        <div className='api-wrapper'>
            <div className='elements-wrapper'>
                <h2 className='title'>{ label }</h2>
                <p className='description'>{ description }</p>
            </div>
            <div className='api-key-wrapper'>
                <input value={ api } placeholder={ placeholder } id={ key } onChange={ handleApiKeyChange } />
            </div>
        </div>
    );
}

ApiDivStructure.defaultProps = {
    label: 'YouTube API Key',
    description: 'Insert your api key here to render a video playlist in the website.',
    placeholder: 'AIzaSyC4JZb8vS2hLxxxxxxx_xxxxxxxx_xxxxxxxxx',
    options: '',
    setOption: null
}

/**
 * Youtube repeater 
 * 
 * @since 1.0.0
 */
const YoutubeRepeater = ( props ) => {
    const { getKeyValuePair } = props
    const key = 'youtube_urls'
    const urlRepeater = getKeyValuePair[ key ]

    /**
     * Adding to repeater
     * 
     * @since 1.0.0
     */
    const addToRepeater = () => {
        const newValue = [ ...urlRepeater, '' ]
        props.setOption({ ...getKeyValuePair, [key]: newValue })
    }

    /**
     * Removing from repeater
     * 
     * @since 1.0.0
     */
    const removeFromRepeater = ( index ) => {
        const newValue = [ ...urlRepeater.slice( 0, index ), ...urlRepeater.slice( index + 1 ) ]
        props.setOption({ ...getKeyValuePair, [key]: newValue })
    }

    /**
     * Handle change in url
     * 
     * @since 1.0.0
     */
    const handleUrlChange = ( event, index ) => {
        let value = event.target.value
        const newValue = [ ...urlRepeater.slice( 0, index ), value, ...urlRepeater.slice( index + 1 ) ]
        props.setOption({ ...getKeyValuePair, [key]: newValue })
    }

    return <div className='youtube-wrapper'>
        <h2 className='title'>{ 'Enter Urls' }</h2>
        <ul className='repeater-wrapper'>
            {
                urlRepeater?.map(( url, index ) => {
                    return <li className='repeater-field' key={ index }>
                        <label htmlFor={ index }>{ 'URL' }</label>
                        <input className='link' id={ index } value={ url } placeholder='http://example' onChange={( event ) => handleUrlChange( event, index )}/>
                        { urlRepeater.length > 1 && <button className="remove-url" onClick={() => removeFromRepeater( index )}>{ 'Remove' }</button> }
                    </li>
                })
            }
        </ul>
        <button className='add-url' onClick={ addToRepeater }>{ 'Add' }</button>
    </div>
}