import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons'

export default function MediaUpload () {
    return (
        <>
            <input type="file" id="file-upload-handle" onChange={(event) => console.log(event)}/>
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
        </>
    );
}
