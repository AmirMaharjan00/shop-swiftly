import react, { useState, useEffect, useMemo, useCallback, createContext, useContext, useRef } from 'react'
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
    const { reportHTML, reportData } = context

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
                    ( reportData.length > 0 ) ? reportData.map(( order, index ) => {
                        const { order_id: Id, order_date: date, product_id: productId, user_id: userId } = order
                        return <tr className='products-element products-table-body' key={ index }>
                                <td className='body-item'>{ index + 1 }</td>
                                <td className='body-item'>{ getTheDate( date ) }</td>
                                <td className='body-item title'>{ 'title' }</td>
                                <td className='body-item'>{ 'stock' }</td>
                                <td className='body-item'>{ 'Rs ' + 'price' }</td>
                                <td className='body-item'>{ 'category' }</td>
                            </tr>
                        })
                    : <tr className='products-element products-table-body no-products'><td className='body-item' colSpan={8}>No Products</td></tr> 
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
        const doc = new jsPDF();
    
        // Using html method of jsPDF to directly convert HTML to PDF
        doc.html( reportHTML.current, {
            callback: function (doc) {
                doc.save('downloaded-content.pdf'); // Save the PDF
            },
            // x: 10, // Starting X coordinate
            // y: 10, // Starting Y coordinate
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