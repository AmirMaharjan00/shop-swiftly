import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons'

export default function MediaUpload ({ onFilesSelect }) {
    // const [ files, setFiles ] = useState([])

    // useEffect(() => {
    //     handleUpload()
    // }, [ files ])

    const handleUpload = ( uploads ) => {
        const UPLOADS = [ ...uploads ]
        const FORMDATA = new FormData();
        FORMDATA.append( 'post_type', 'media' )
        UPLOADS.forEach(( file, index ) => {
            let count = index + 1
            FORMDATA.append( 'images_' + count, file )
        } )
        fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', {
            method : 'POST',
            body: FORMDATA
        })
    }

    return (
        <form encType='multipart/form-data' id="media-form" name='media-form'>
            <input type="file" id="file-upload-handle" name="file-upload-handle" onChange={( event ) => handleUpload( event.target.files )} hidden multiple/>
            <label htmlFor="file-upload-handle">
                <div className='upload-wrapper'>
                    <div className='overlay-wrapper'></div>
                    <span className='icon-wrapper'>
                        <FontAwesomeIcon icon={ faFileCirclePlus } />
                    </span>
                    <span className='sub-title'>{ 'Select Files to Upload' }</span>
                    <span className='description'>{ 'or Drag and Drop, Copy and Paste Files' }</span>
                </div>
            </label>
        </form>
    );
}