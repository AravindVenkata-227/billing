import React, { useEffect, useState, useRef } from 'react';
import api from '../../../api/api';
import AddCustomer from '../../UIElements/AddCustomer/AddCustomer';
import Card from '../../UIElements/Card/Card';
import ReactToPrint from 'react-to-print';
import Notification from '../../UIElements/Notification/Notification';
import './BillPanel.css'
import { AiOutlinePrinter } from 'react-icons/ai';
const BillPanel = (props) => {
    const [state, setState] = useState([])
    const [input, setInput] = useState('')
    const [alert, setAlert] = useState({
        customerNF: false,
        emptyTable: false
    })
    const [customerModal, setCustomerModal] = useState(false)
    const [printState, setPrintState] = useState(true)
    const [customer, setCustomer] = useState(false)
    const componentRef = useRef();

    const [notification, setNotification] = useState({
        state: 'off',
        message: "",
        type: ''
    })
    const [saveLoader, setSaveLoader] = useState(false)

    useEffect(() => {
        setState(props.state)
    }, [])

    useEffect(() => {
        if (notification.state === 'on') {
            setTimeout(() => {
                setNotification({
                    state: 'off',
                    message: '',
                    type: ''
                })
            }, 2000);
        }

    }, [notification])

    const closeModal = () => {
        setAlert({
            customerNF: false,
            emptyTable: false
        })
        setCustomerModal(false)
    }

    const openCustomerModal = () => {
        setCustomerModal(true)
    }


    const findCustomer = () => {
        setSaveLoader(true)
        api.get(`/search/customer/${input}`).then((response) => {
            setSaveLoader(false)
            setAlert(prev => ({ ...prev, customerNF: false }))
            setCustomer(response.data[0])
            setPrintState(false)
        }).catch(() => {
            setSaveLoader(false)
            setCustomer(false)
            setAlert(prev => ({ ...prev, customerNF: true }))
        })
    }

    const saveBillHandler = () => {
        setSaveLoader(true)
        if (state.length === 0) {
            setSaveLoader(false)
            setAlert(prev => ({ ...prev, emptyTable: true }))
            return
        }
        if (!customer) {
            setSaveLoader(false)
            setAlert(prev => ({ ...prev, customerNF: true }))
            return
        }

        const sendData = state.map(item => {
            return [item.item_id, item.quantity]
        })
        const finalData = {
            "cust_id": customer.cust_id,
            "items": sendData
        }

        api.post('/create/add_bill', finalData).then(() => {
            setSaveLoader(false)
            props.close()
            props.setNotification({
                state: 'on',
                message: 'Bill created successfully',
                type: 'success'
            })
            props.stateHandler([])
            props.force()
        }).catch((error) => {
            setSaveLoader(false)
            props.close()
            props.setNotification({
                state: 'on',
                message: 'Something went wrong. Please try again.',
                type: 'danger'
            })
        })
    }
    return <>

        {notification.state === "on" ? <Notification text={notification.message} type={notification.type} /> : null}
        {customerModal && <AddCustomer closeHandler={closeModal} getValues={setCustomer} setInput={setInput} />}
        <Card heading="Bill Panel" close={props.close} submitHandler={saveBillHandler}>
            {saveLoader && <div className='loader'>Please Wait...</div>}

            <div className='customer-search-container'>
                <label htmlFor='customer-search'>Customer Phno or Email:</label>
                <div className='customer-form-group'>
                    <input type="text" placeholder="Email or Phno" value={input} className={'customer-search ' + (alert.customerNF ? 'danger-border' : '')} id='customer-search' onChange={e => setInput(e.target.value)} />
                    <button className='customer-find' onClick={findCustomer}>Find</button>
                </div>
                {alert.customerNF && <span className='warning'>Customer not found. </span>}<button className='create-new' onClick={openCustomerModal}>Create New</button>
            </div>
            {customer && <div className='customer-name'>Customer Name: <span className='colored'>{customer.cust_name}</span></div>}
            <div className='print-btn'>
                <ReactToPrint
                    trigger={() => <button className='customer-find' disabled={printState}><AiOutlinePrinter size="20px" /></button>}
                    content={() => componentRef.current}
                />
            </div>
            <div ref={componentRef} className="bill-table-main">
                <div className='bill-table-container'>
                    <h4 className='brand'>Dkart online</h4>
                    <p className='brand-address'>Dkart Private LTD<br />Mangalore</p>
                    <div className='bill-info-data'>
                        <span className='bill-customer'>Customer Name:{customer.cust_name}</span>
                        <span className='bill-date'>Date:{new Date().toLocaleDateString('en-in')}</span>
                    </div>
                    <table className='bill-table' >
                        <thead>
                            <tr>
                                <td>Product Name</td>
                                <td>Quantity</td>
                                <td>Price</td>
                            </tr>
                        </thead>
                        <tbody>
                            {state.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.item_name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price}</td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                    {alert.emptyTable && <span className='warning'>Table is empty</span>}
                </div>
                <div className='bill-info'>
                    <div>Total Items <span className='colored'>{props.total_items}</span></div>
                    <div>Total Price <span className='colored'>{props.total_price}</span></div>
                </div>
            </div>
        </Card>;
    </>
};

export default BillPanel;
