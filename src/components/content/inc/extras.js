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