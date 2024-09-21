import { Link } from 'react-router-dom';

export const Content = ({ post, exclude }) => {
    const { post_title: title, post_image: image, post_excerpt: excerpt, post_price: price, post_id } = post

    return (
        <article className='post'>
            <figure className='thumbnail-wrapper'>
                <img src={ image } alt=''/>
            </figure>
            <div className='post-elements'>
                { ! exclude.includes( 'title' ) && <h2 className='post-title'><Link to='/single' state={{ ID: post_id }}>{ title }</Link></h2> }
                { ! exclude.includes( 'price' ) && <p className="post-price">{ 'Rs. ' + price }</p> }
                { ! exclude.includes( 'excerpt' ) && <p className="post-excerpt">{ excerpt.split(" ").slice(0, 10).join(" ") + "..." }</p> }
            </div>
        </article>
    )
}

Content.defaultProps = {
    exclude : [ 'title' ]
}