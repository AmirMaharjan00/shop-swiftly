import { useState, useEffect, useMemo, useCallback } from 'react'
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
        let month = monthNames[ monthIndex ]
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

/**
 * Hook to handle users
 * 
 * @since 1.0.0
 */
export const useUsers = () => {
    const [ users, setUsers ] = useState([])

    /**
     * Get the options
     * 
     * @since 1.0.0
     */
    useEffect(() => {
        fetchFunction({
            action: 'select',
            tableIdentity: 'user',
            setterFunction: setUsers
        })
    }, [])

    /**
     * Get single post details
     * 
     * @since 1.0.0
     */
    const getUserDetails = useMemo(() => {
        if( users.length > 0 ) {
            return users.reduce(( newValue, user ) => {
                const { user_id: ID, ...rest } = user
                newValue[ ID ] = rest
                return newValue
            }, {})
        } else {
            return false
        }
    }, [ users ])

    /**
     * Get user name via ID
     * 
     * @since 1.0.0
     */
    const getUserName = useCallback(( userId ) => {
        if( ! getUserDetails ) return ''
        let { user_name } = getUserDetails[ userId ]
        return user_name
    }, [ users ])

    /**
     * Get user email via ID
     * 
     * @since 1.0.0
     */
    const getUserEmail = useCallback(( userId ) => {
        if( ! getUserDetails ) return ''
        let { user_email } = getUserDetails[ userId ]
        return user_email
    }, [ users ])

    /**
     * Get user email via ID
     * 
     * @since 1.0.0
     */
    const getUserRole = useCallback(( userId ) => {
        if( ! getUserDetails ) return ''
        let { user_role } = getUserDetails[ userId ]
        return user_role
    }, [ users ])

    /**
     * Get user password via ID
     * 
     * @since 1.0.0
     */
    const getUserPassword = useCallback(( userId ) => {
        if( ! getUserDetails ) return ''
        let { user_password } = getUserDetails[ userId ]
        return user_password
    }, [ users ])

    return {
        users,
        getUserName,
        getUserEmail,
        getUserRole,
        getUserPassword
    }
}

/**
 * Hook to handle posts
 * 
 * @since 1.0.0
 */
export const usePosts = () => {
    const [ posts, setPosts ] = useState([])

    /**
     * Get the options
     * 
     * @since 1.0.0
     */
    useEffect(() => {
        fetchFunction({
            action: 'select',
            tableIdentity: 'post',
            setterFunction: setPosts
        })
    }, [])

    /**
     * Get single post details
     * 
     * @since 1.0.0
     */
    const getPostDetails = useMemo(() => {
        if( posts.length > 0 ) {
            return posts.reduce(( newValue, post ) => {
                const { post_id: ID, ...rest } = post
                newValue[ ID ] = rest
                return newValue
            }, {})
        } else {
            return false
        }
    }, [ posts ])

    /**
     * Get user name via ID
     * 
     * @since 1.0.0
     */
    const getPostTitle = useCallback(( postId ) => {
        if( ! getPostDetails ) return ''
        if( postId.includes( ',' ) ) {
            let postIdsSplit = postId.split(',')
            let joinedPostTitles = postIdsSplit.reduce(( newValue, id ) => {
                let { post_title: title } = getPostDetails[ id ]
                newValue = [ ...newValue, title ]
                return newValue
            }, [])
            return joinedPostTitles.join(', ')
        } else {
            let { post_title: title } = getPostDetails[ postId ]
            return title
        }
    }, [ posts ])

    /**
     * Get posts via post status
     * 
     * @since 1.0.0
     */
    const getPostViaStatus = useCallback(( status = 'publish' ) => {
        if( posts.length < 0 ) return []
        return posts.reduce(( newValue, post ) => {
            let { post_status } = post
            if( post_status === status ) newValue = [ ...newValue, post ]
            return newValue
        }, [])
    }, [ posts ])

    return {
        posts,
        getPostTitle,
        getPostViaStatus
    }
}

/**
 * Hook to handle Orders
 * 
 * @since 1.0.0
 */
export const useOrders = () => {
    const [ orders, setOrders ] = useState([])

    /**
     * Get the options
     * 
     * @since 1.0.0
     */
    useEffect(() => {
        fetchFunction({
            action: 'select',
            tableIdentity: 'order',
            setterFunction: setOrders
        })
    }, [])

    /**
     * Get user name via ID
     * 
     * @since 1.0.0
     */
    const getUserOrders = useCallback(( userId ) => {
        if( ! orders.length > 0 ) return []
        return orders.reduce(( newValue, order ) => {
            let { user_id } = order
            if( user_id === userId ) newValue = [ ...newValue, order ]
            return newValue
        }, [])
    }, [ orders ])

    
    /**
     * Check if is today
     * 
     * @since 1.0.0
     */
    const isToday = ( timeStamp ) => {
        const today = new Date()
        const date = new Date( parseInt( timeStamp ) )

        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        return today.getTime() === date.getTime();
    }

    /**
     * Check if is week
     * 
     * @since 1.0.0
     */
    const isWeek = ( timeStamp ) => {
        const now = new Date();
        const givenDate = new Date( parseInt( timeStamp ) );

        // Get the current day of the week (0-6, where 0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const currentDay = now.getDay();

        // Calculate the start of the current week (Sunday at 00:00)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - currentDay);  // Go back to Sunday
        startOfWeek.setHours(0, 0, 0, 0);  // Set to midnight to ignore time

        // Calculate the end of the current week (Saturday at 23:59)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to Saturday
        endOfWeek.setHours(23, 59, 59, 999); // Set to end of the day

        // Compare if the given date is within this week range
        return givenDate >= startOfWeek && givenDate <= endOfWeek;
    }

    /**
     * Check if is Month
     * 
     * @since 1.0.0
     */
    const isMonth = ( timeStamp ) => {
        const now = new Date();
        const givenDate = new Date( parseInt( timeStamp ) );

        // Check if the year and month match
        return now.getFullYear() === givenDate.getFullYear() && now.getMonth() === givenDate.getMonth();
    }

     /**
     * Get orders using time
     * 
     * @since 1.0.0
     */
     const getOrdersViaTime = useCallback(( time = 'daily' ) => {
        if( orders.length > 0 ) {
            return orders.filter(( order ) => {
                const { order_date: date } = order
                if( time === 'daily' ) {
                    if( isToday( date ) ) return true
                } else if( time === 'week' ) {
                    if( isWeek( date ) ) return true
                } else if( time === 'month' ) {
                    if( isMonth( date ) ) return true
                }
            })
        } else {
            return []
        }
    }, [ orders ])

    return {
        orders,
        getUserOrders,
        isToday,
        isWeek,
        isMonth,
        getOrdersViaTime
    }
}

/**
 * Hook to handle pages
 * 
 * @since 1.0.0
 */
export const usePages = () => {
    const [ pages, setPages ] = useState([])

    /**
     * Get the options
     * 
     * @since 1.0.0
     */
    useEffect(() => {
        fetchFunction({
            action: 'select',
            tableIdentity: 'page',
            setterFunction: setPages
        })
    }, [])

    /**
     * Get single page details
     * 
     * @since 1.0.0
     */
    const getPageDetails = useMemo(() => {
        if( pages.length > 0 ) {
            return pages.reduce(( newValue, page ) => {
                const { page_id: ID, ...rest } = page
                newValue[ ID ] = rest
                return newValue
            }, {})
        } else {
            return false
        }
    }, [ pages ])

    /**
     * Get user name via ID
     * 
     * @since 1.0.0
     */
    const getPageTitle = useCallback(( pageId ) => {
        if( ! getPageDetails ) return ''
        if( pageId.includes( ',' ) ) {
            let pageIdsSplit = pageId.split(',')
            let joinedPostTitles = pageIdsSplit.reduce(( newValue, id ) => {
                let { page_title: title } = getPageDetails[ id ]
                newValue = [ ...newValue, title ]
                return newValue
            }, [])
            return joinedPostTitles.join(', ')
        } else {
            let { page_title: title } = getPageDetails[ pageId ]
            return title
        }
    }, [ pages ])

    /**
     * Get pages via post status
     * 
     * @since 1.0.0
     */
    const getPageViaStatus = useCallback(( status = 'publish' ) => {
        if( pages.length < 0 ) return []
        return pages.reduce(( newValue, page ) => {
            let { page_status } = page
            if( page_status === status ) newValue = [ ...newValue, page ]
            return newValue
        }, [])
    }, [ pages ])

    return {
        pages,
        getPageTitle,
        getPageViaStatus
    }
}