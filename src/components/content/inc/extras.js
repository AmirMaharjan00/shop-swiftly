import { useState } from 'react'
import { useSession } from './hooks'

export const SectionWrapper = ({ main, children, id }) => {
    return (
        <section className={ main } id={ id === undefined ? main : id }>
            <div className='container'>
                <div className='row'>
                    { children !== undefined && children }
                </div>
            </div>
        </section>
    )
}

/**
 * Add to cart
 * 
 * @since 1.0.0
 */
export const AddToCartButton = ( props ) => {
    const { productId: ID } = props
    const { loggedIn, parsedProductDetails } = useSession()
    const [ label, setLabel ] = useState( 'Add to cart' )

    /**
     * Handle click event
     * 
     * @since 1.0.0
     */
    const handleClick = () => {
        if( loggedIn && ! parsedProductDetails.includes( ID ) ) {
            sessionStorage.setItem( 'productDetails', JSON.stringify([ ...parsedProductDetails, ID ]) )
            setLabel( 'Added' )
        } else {
            setLabel( 'Sorry, You are not logged in.' )
        }
    }

    return <div className='add-to-cart'>
        <button onClick={ handleClick }>{ label }</button>
    </div>
}