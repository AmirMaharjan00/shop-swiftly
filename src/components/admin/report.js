import { useState, useEffect, useMemo, createContext, useContext, useRef } from 'react'
import { fetchFunction } from '../content/functions'
import { usePostRelatedHooks, useQuery } from '../content/inc/hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { jsPDF } from 'jspdf';
const REPORTCONTEXT = createContext()

export const Report = () => {
    const [ activeTimePeriod, setActiveTimePeriod ] = useState( 'daily' )
    const reportHTML = useRef()
    const [ reportData, setReportData ] = useState([])

    useEffect(() => {
        fetchFunction({
            action: 'select',
            tableIdentity: 'order',
            setterFunction: setReportData
        })
    }, [])

    const contextObject = {
        time: activeTimePeriod,
        setTime: setActiveTimePeriod,
        reportHTML,
        reportData
    }

    return <div className='report-section-wrappper' id="report-section-wrappper">
        <REPORTCONTEXT.Provider value={ contextObject }>
            <div className='buttons-wrapper'>
                <TimePeriod />
                <DownloadButton />
            </div>
            <ReportTable />
        </REPORTCONTEXT.Provider>
    </div>
}

/**
 * Report on basis of time period
 * 
 * @since 1.0.0
 */
const TimePeriod = () => {
    const context = useContext( REPORTCONTEXT )
    const { time, setTime } = context
    return <div className='time-period-tabs-wrapper'>
        <button className={ 'time-period' + ( ( time === 'month' ) ? ' active' : '' ) } onClick={() => setTime( 'month' )}>{ 'Month' }</button>
        <button className={ 'time-period' + ( ( time === 'week' ) ? ' active' : '' ) } onClick={() => setTime( 'week' )}>{ 'Week' }</button>
        <button className={ 'time-period' + ( ( time === 'daily' ) ? ' active' : '' ) } onClick={() => setTime( 'daily' )}>{ 'Daily' }</button>
    </div>
}

/**
 * Report table
 * 
 * @since 1.0.0
 */
const ReportTable = () => {
    const context = useContext( REPORTCONTEXT )
    const { getTheDate } = usePostRelatedHooks()
    const { posts } = useQuery( 'post' )
    const { reportHTML, reportData, time } = context

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
     * Filtered Orders
     */
    const filteredOrders = useMemo(() => {
        if( reportData.length > 0 ) {
            return reportData.filter(( order ) => {
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
    })

    return <div className='report-table-wrapper'>
        <table className='products-wrap' ref={ reportHTML }>
            <thead>
                <tr className='products-element products-table-head'>
                    <th className='head-item'>{ 'S.No' }</th>
                    <th className='head-item'>{ 'Date' }</th>
                    <th className='head-item title'>{ 'Product Name' }</th>
                    <th className='head-item'>{ 'Quantity Sold' }</th>
                    <th className='head-item'>{ 'Unit Price' }</th>
                    <th className='head-item'>{ 'Total Sales' }</th>
                </tr>
            </thead>
            <tbody>
                {
                    ( filteredOrders.length > 0 ) ? filteredOrders.map(( order, index ) => {
                        const { order_id: Id, order_date: date, product_id: productId, user_id: userId, order_price: price, order_quantity: quantity } = order
                        return <tr className='products-element products-table-body' key={ index }>
                            <td className='body-item'>{ index + 1 }</td>
                            <td className='body-item'>{ getTheDate( date ) }</td>
                            <td className='body-item title'>{ 'title' }</td>
                            <td className='body-item'>{ quantity }</td>
                            <td className='body-item'>{ 'Rs ' + price }</td>
                            <td className='body-item'>{ 'Rs ' + ( quantity * price ) }</td>
                        </tr>
                    }) : <tr className='products-element products-table-body no-products'><td className='body-item' colSpan={8}>No Products</td></tr> 
                }
            </tbody>
        </table>
    </div>
}

/**
 * Download pdf button
 * 
 * @since 1.0.0
 */
const DownloadButton = () => {
    const context = useContext( REPORTCONTEXT )
    const { reportHTML } = context

    /**
     * On click download pdf of sales report
     * 
     * @since 1.0.0
     */
    const downloadPdf = () => {
        // .outerHTML
        const doc = new jsPDF( 'l', 'mm', 'a4' );
    
        doc.setFontSize(20);
        // Using html method of jsPDF to directly convert HTML to PDF
        doc.html( reportHTML.current, {
            callback: function (doc) {
                doc.setFontSize(10);
                doc.save('report.pdf'); // Save the PDF
            },
            margin: [10, 10, 10, 10], // Optional margins
            // width: 180, // Control the width to fit the content properly
            // windowWidth: 600, // Adjust the window width for scaling (to control zoom level)
            html2canvas: {
              scale: 0.5, // Adjust the scale of the HTML to PDF conversion (0.5 to reduce zoom)
            }
        });
    }

    return <button className='download-button' onClick={ downloadPdf }>
        <FontAwesomeIcon
            icon = { faDownload } 
            className = 'download-icon'
        />
        <span className='download-label'>{ 'Download PDF' }</span>
    </button>
}