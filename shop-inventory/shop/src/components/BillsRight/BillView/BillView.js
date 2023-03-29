import React, { useEffect, useState, useRef } from 'react';
import './BillView.css'
import ReactToPrint from 'react-to-print';
import { AiOutlinePrinter } from 'react-icons/ai'
const BillView = (props) => {
    const [state, setState] = useState([])
    useEffect(() => {
        setState(props.state)
        console.log(props.state)
    }, [])
    const componentRef = useRef();

    return <div className='bills-view'>
        <h3 className='bills-heading'>Bill Info</h3>
        <div className='print-button-container'>
            <span className='bill-data'>Bill ID: <span className="colored">#{props.bill_id}</span></span>
            <ReactToPrint
                trigger={() => <button className='print-button'><AiOutlinePrinter size="20px" /></button>}
                content={() => componentRef.current}
            />
        </div>
        <div className='bill-table-main' ref={componentRef}>
            <h4 className='brand'>Dkart online</h4>
            <p className='brand-address'>Dkart Private LTD<br />Mangalore</p>
            <div className='bill-info-data'>
                <span className='bill-data'>Bill ID: <span className="colored">#{props.bill_id}</span></span>
                <span className='bill-data'>Customer Name: {props.cust_name}</span>
                <span className='bill-data'>Date:{new Date().toLocaleDateString('en-in')}</span>
            </div>
            <div className='bills-content'>
                <table className='bills-table'>
                    <thead>
                        <tr>
                            <td>Item Name</td>
                            <td>Quantity</td>
                            <td>Price</td>
                            <td>Total</td>
                        </tr>
                    </thead>
                    <tbody>
                        {state.map((item, index) => {
                            return <tr key={index}>
                                <td>{item.item_name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price}</td>
                                <td>{item.total}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            <div className='bills-btns'>
                <div className='total-items'>Total Products: <span className='colored'>{props.total_items}</span></div>
                <div className='total-price'>Total Price: <span className='colored'>{props.total_price}</span></div>
                <button className='bills-close' onClick={props.close}>Close</button>
            </div>
        </div>
    </div>;
};

export default BillView;
