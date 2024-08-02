import { Link } from 'react-router-dom';

export const Content = ({ post, exclude }) => {
    const { post_title: title, post_image: image, post_excerpt: excerpt, post_price: price, post_id } = post

    return (
        <article className='post'>
            <figure className='thumbnail-wrapper'>
                <img src={ image } alt=''/>
            </figure>
            <div className='post-elements'>
                <Link to='/single' state={{ ID: post_id }}>{ ! exclude.includes( 'title' ) && <h2 className='post-title'>{ title }</h2> }</Link>
                { ! exclude.includes( 'excerpt' ) && <p className="post-excerpt">{ excerpt }</p> }
                { ! exclude.includes( 'price' ) && <p className="post-price">{ 'Rs. ' + price }</p> }
            </div>
        </article>
    )
}

Content.defaultProps = {
    exclude : [ 'title' ]
}