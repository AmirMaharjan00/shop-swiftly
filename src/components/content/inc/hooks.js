import { useState, useEffect, useMemo } from 'react'
import { fetchFunction } from '../functions'

/**
 * Post related hooks
 * 
 * @since 1.0.0
 */
export const usePostRelatedHooks = () => {
    const [ categories, setCategories ] = useState([])

    useEffect(() => {
        fetchFunction({
            action: 'select',
            tableIdentity: 'category',
            setterFunction: setCategories
        })
    }, [])
    /**
     * Get the date from the given timestamp
     * 
     * @since 1.0.0
     */
    const getTheDate = ( timestamp ) => {
        let date = new Date( parseInt( timestamp ) )
        let year = date.getFullYear()
        let monthIndex = date.getMonth()
        let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let month = monthNames[ monthIndex + 1 ]
        let day = date.getDate()
        return month + " " +  day + ", " + year
    }

    /**
     * Get the category name from the given category index
     * 
     * @since 1.0.0
     */
    const getCategory = ( indexString ) => {
        let removeFirstComma = indexString.replace( ',', '' )
        let indexArray
        if( removeFirstComma.includes(',') ) {
            indexArray = removeFirstComma.split(',')
        } else {
            indexArray = [ removeFirstComma ]
        }

        let catArray = []
        categories.map(( category ) => {
            const { category_id: ID, category_title: title } = category
            if( indexArray.includes( ID.toString() ) ) catArray.push( title )
        })

        return catArray
    }

    return {
        getTheDate,
        getCategory
    }
}

/**
 * Hooks to handle session
 * 
 * @since 1.0.0
 */
export const useSession = () => {
    const userId = sessionStorage.getItem( 'userId' )
    const loggedIn = sessionStorage.getItem( 'loggedIn' )
    const productDetails = sessionStorage.getItem( 'productDetails' )
    const parsedProductDetails = JSON.parse( productDetails )
    const [ products, setProducts ] = useState([])

    /**
     * Get the category name from the given category index
     * 
     * @since 1.0.0
     */
    useEffect(() => {
        let value = []
        if( parsedProductDetails !== null ) {
            parsedProductDetails.map(( productId ) => {
                const FORMDATA = new FormData()
                FORMDATA.append( 'action', 'select_where' )
                FORMDATA.append( 'table_identity', 'post' )
                if( productId !== undefined ) FORMDATA.append( 'post', productId )
                fetch( 'http://localhost/shop-swiftly/src/components/admin/inc/database/index.php', {
                    method: 'POST',
                    body: FORMDATA
                })
                .then((res) => res.json())
                .then(( data ) => value.push( data ))
            })
        }
        setProducts( value )
    }, [ productDetails ])

    return {
        userId,
        loggedIn,
        parsedProductDetails,
        products
    }
}

/**
 * Hooks to handle session
 * 
 * @since 1.0.0
 */
export const useOptions = () => {
    const [ options, setOptions ] = useState({})

    /**
     * Get the options
     * 
     * @since 1.0.0
     */
    useEffect(() => {
        fetchFunction({
            action: 'select',
            tableIdentity: 'options',
            setterFunction: setOptions
        })
    }, [])

    /**
     * Get option keys
     * 
     * @since 1.0.0
     */
    const keys = useMemo(() => {
        if( Array.isArray( options ) ) {
            return options.reduce(( newValue, option ) => {
                const { option_key: key } = option
                newValue = [ ...newValue, key ]
                return newValue
            }, [])
        } else {
            return []
        }
    }, [ options ])

    /**
     * Get key value pairs
     * 
     * @since 1.0.0
     */
    const keyValuePairs = useMemo(() => {
        if( Array.isArray( options ) ) {
            return options.reduce(( newValue, option ) => {
                const { option_key: key, option_value: value } = option
                newValue = { ...newValue, [key]: value }
                return newValue
            }, {})
        } else {
            return {}
        }
    }, [ options ])

    return {
        options,
        keys,
        keyValuePairs
    }
}

/**
 * Hook to handle posts
 * 
 * @since 1.0.0
 */
export const useQuery = ( table ) => {
    const [ posts, setPosts ] = useState([])

    /**
     * Get the options
     * 
     * @since 1.0.0
     */
    useEffect(() => {
        fetchFunction({
            action: 'select',
            tableIdentity: table,
            setterFunction: setPosts
        })
    }, [])

    return {
        posts
    }
}