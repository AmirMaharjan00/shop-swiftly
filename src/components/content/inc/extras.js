import react from 'react'

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

    /**
     * Handle click event
     * 
     * @since 1.0.0
     */
    const handleClick = () => {
        let cartProducts = sessionStorage.getItem( 'productDetails', ID )
        let parsedCartProducts = JSON.parse( cartProducts )
        if( ! parsedCartProducts.includes( ID ) ) {
            sessionStorage.setItem( 'productDetails', JSON.stringify([ ...parsedCartProducts, ID ]) )
        }
    }

    return <div className='add-to-cart'>
        <button onClick={ handleClick }>{ 'Add to cart' }</button>
    </div>
}