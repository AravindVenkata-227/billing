import React from 'react'
import { useEffect, useState } from 'react';
import $ from 'jquery'
import { RiDeleteBinLine } from 'react-icons/ri'
import { BiShowAlt } from 'react-icons/bi'
import Loading from '../../UIElements/Loading/Loading';
import api from '../../../api/api';
import Notification from '../../UIElements/Notification/Notification';
import Modal from '../../UIElements/Modal/Modal';
import Confirm from './../../UIElements/Confirm/Confirm';
import BillView from '../BillView/BillView';
import NetworkError from '../../UIElements/NetworkError/NetworkError';
const BillsContent = () => {

    const [state, setState] = useState([])
    const [billItems, setBillItems] = useState(false)
    const [networkError, setNetworkError] = useState(false)

    const [isLoading, setLoading] = useState(false)
    const [billLoad, setBillLoad] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteParams, setDeleteParams] = useState({})
    const [reload, setReload] = useState(0)

    const forceReload = () => {
        setReload(prev => prev + 1)
    };
    const handleDelete = (id, customer_name, price) => {
        setDeleteParams({
            id,
            customer_name,
            price
        })
        setDeleteModal(true)
    }

    const closeModal = () => {
        setDeleteModal(false)
    }

    const getBills = () => {
        api.get('/fetch/bills')
            .then(function (response) {
                setState(response.data)
            })
            .catch(function (error) {
                setNetworkError(true)
            }).then(() => {
                setLoading(false)
                $('#bills-table').DataTable();
                $('input[type="search"]')[0].placeholder = "Search"
                $('input[type="search"]')[0].previousSibling.textContent = '';
            })
    }

    const deleteFromDB = () => {
        setDeleteModal(false)
        api.delete(`/delete/delete_bills/${deleteParams.id}`)
            .then(() => {
                setDeleteParams({ ...deleteParams, message: "Bill from " + deleteParams.customer_name + ' deleted successfully', type: 'success' })
                forceReload()

            })
            .catch((error) => {
                setDeleteParams({ ...deleteParams, message: ' Unable to delete bill from' + deleteParams.customer_name, type: 'danger' })
            }).then(() => {
                setTimeout(() => {
                    setDeleteParams({})
                }, 2000);
            })
    }
    const handleSearch = (id, total_items, total_price, cust_name) => {
        setBillLoad(true)
        api.get(`/search/bills/${id}`).then((response) => {
            setBillLoad(false)
            setBillItems({
                bill_id: id,
                cust_name,
                total_items,
                total_price,
                data: response.data.results
            })
        }).catch((error) => {
            setBillLoad(false)
            console.log(error)
        })
    }

    const closeBillView = () => {
        setBillItems(false)
    }

    useEffect(() => {
        setLoading(true)
        getBills()
    }, [reload])

    let content
    if (isLoading)
        content = <Loading />
    else {
        content = <table className='table-content' id="bills-table">
            <thead>
                <tr className='table-heading'>
                    <td>ID</td>
                    <td>Customer Name</td>
                    <td>Date</td>
                    <td>Mobile Number</td>
                    <td>Total Products</td>
                    <td>Price</td>
                    <td>Modify</td>
                </tr>
            </thead>
            <tbody>
                {state.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.cust_name}</td>
                            <td>{new Date(item.bill_date).toLocaleString('en-IN').toUpperCase()}</td>
                            <td>{item.mobile_no}</td>
                            <td>{item.total_items}</td>
                            <td>{item.price}</td>
                            <td>
                                <button className='modify-btn' onClick={() => handleSearch(item.bill_id, item.total_items, item.price, item.cust_name)}>
                                    <BiShowAlt color="#4C6FE6" size={20} />
                                </button>
                                <button className='modify-btn' onClick={() => handleDelete(item.bill_id, item.cust_name, item.price)}>
                                    <RiDeleteBinLine color="#ED374E" size={20} />
                                </button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    }

    return (
        <div key={reload}>
            {networkError && <NetworkError />}
            <div>
                {billLoad && <Modal><Loading /></Modal>}

            </div>
            {content}
            {billItems && <Modal><BillView state={billItems.data} close={closeBillView} total_items={billItems.total_items} total_price={billItems.total_price} bill_id={billItems.bill_id} cust_name={billItems.cust_name} /></Modal>}
            {deleteParams.type && <Notification text={deleteParams.message} type={deleteParams.type} />}
            {deleteModal && <Modal><Confirm content={"Bill from " + deleteParams.customer_name + " with amount " + deleteParams.price} delete={deleteFromDB} closeModal={closeModal} /></Modal>}
        </div>

    )
}

export default BillsContent
