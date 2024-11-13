import react from 'react'
import { useSession } from './hooks'

export const SectionWrapper = ({ main, children }) => {
    return (
        <section className={ main }>
            <div className='container'>
                <div className='row'>
                    { children !== undefined && children }
                </div>
            </div>
        </section>
    )
}

export const AddToCartButton = ( props ) => {
    const { productId: ID } = props
    const { loggedIn, parsedProductDetails } = useSession()

    /**
     * Handle click event
     * 
     * @since 1.0.0
     */
    const handleClick = () => {
        if( loggedIn && ! parsedProductDetails.includes( ID ) ) {
            sessionStorage.setItem( 'productDetails', JSON.stringify([ ...parsedProductDetails, ID ]) )
        }
    }

    return <div className='add-to-cart'>
        <button onClick={ handleClick }>{ 'Add to cart' }</button>
    </div>
}