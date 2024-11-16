import React from 'react'
import logo from '../admin/assets/images/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopyright } from '@fortawesome/free-solid-svg-icons'
import { faLinkedinIn, faSquareFacebook, faInstagram, faYoutube, faWhatsapp, faViber } from '@fortawesome/free-brands-svg-icons'

export default function Footer() {
    return (
        <footer className='site-footer'>
            <div className='container'>
                <div className='row'>
                    <div className='footer-wrapper'>
                        <figure className='logo-wrapper'>
                            <img className="logo" src={ logo }/>
                        </figure>
                        <div className='social-icons-wrapper'>
                            <span className='prefix'>{ 'Connect with us: ' }</span>
                            <div className='social-icons'>
                                <FontAwesomeIcon icon={ faLinkedinIn } className='linkedin social-icon first'/>
                                <FontAwesomeIcon icon={ faSquareFacebook } className='facebook social-icon'/>
                                <FontAwesomeIcon icon={ faInstagram } className='instagram social-icon'/>
                                <FontAwesomeIcon icon={ faYoutube } className='youtube social-icon'/>
                                <FontAwesomeIcon icon={ faWhatsapp } className='whatsapp social-icon'/>
                                <FontAwesomeIcon icon={ faViber } className='viber social-icon last'/>
                            </div>
                        </div>
                        <div className='copyright'>
                            <FontAwesomeIcon icon={ faCopyright } className='copyright-icon'/>
                            <span className='company'>{'Shop Swiftly Pvt. Ltd.'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}