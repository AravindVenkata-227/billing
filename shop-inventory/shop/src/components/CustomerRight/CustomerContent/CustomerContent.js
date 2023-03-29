import React from 'react'
import { useEffect, useState } from 'react';
import $ from 'jquery'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBinLine } from 'react-icons/ri'
import api from '../../../api/api';
import Loading from './../../UIElements/Loading/Loading';
import Notification from '../../UIElements/Notification/Notification';
import Modal from '../../UIElements/Modal/Modal';
import Confirm from './../../UIElements/Confirm/Confirm';
import AddCustomer from '../../UIElements/AddCustomer/AddCustomer';
import NetworkError from '../../UIElements/NetworkError/NetworkError';

const CustomerContent = () => {
    const [state, setState] = useState([])

    const [isLoading, setLoading] = useState(false)
    const [modifyModal, setModifyModal] = useState(false)
    const [modifyParams, setModifyParams] = useState()
    const [networkError, setNetworkError] = useState(false)

    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteParams, setDeleteParams] = useState({})
    const [reload, setReload] = useState(0)

    const forceReload = () => {
        setReload((prev) => prev + 1)
    };
    const handleDelete = (id, customer_name) => {
        setDeleteParams({
            id,
            customer_name
        })
        setDeleteModal(true)
    }

    const handleModify = (id) => {
        setModifyParams(id)
        setModifyModal(true)
    }

    const closeModal = () => {
        setDeleteModal(false)
        setModifyModal(false)
    }


    const getCustomers = () => {
        api.get('/fetch/customers')
            .then(function (response) {
                setState(response.data)
            })
            .catch(function (error) {
                setNetworkError(true)
            }).then(() => {
                setLoading(false)
                $('#customers-table').DataTable();
                $('input[type="search"]')[0].placeholder = "Search"
                $('input[type="search"]')[0].previousSibling.textContent = '';
            })
    }


    const deleteFromDB = () => {
        setDeleteModal(false)
        api.delete(`/delete/delete_customer/${deleteParams.id}`)
            .then(() => {
                setDeleteParams({ ...deleteParams, message: deleteParams.customer_name + ' deleted successfully', type: 'success' })
                forceReload()

            })
            .catch((error) => {
                setDeleteParams({ ...deleteParams, message: ' Unable to delete ' + deleteParams.customer_name, type: 'danger' })
            }).then(() => {
                setTimeout(() => {
                    setDeleteParams({})
                }, 2000);
            })
    }


    useEffect(() => {
        setLoading(true)
        getCustomers()

    }, [reload])

    let content
    if (isLoading)
        content = <Loading />
    else {
        content = <table className='table-content' id="customers-table">
            <thead>
                <tr className='table-heading'>
                    <td>ID</td>
                    <td>Customer Name</td>
                    <td>Address</td>
                    <td>Mobile Number</td>
                    <td>Email Address</td>
                    <td>Modify</td>
                </tr>
            </thead>
            <tbody>
                {state.map((value, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{value.cust_name}</td>
                            <td>{value.address}</td>
                            <td>{value.mobile_no}</td>
                            <td>{value.email}</td>

                            <td>
                                <button className='modify-btn' onClick={() => handleModify(value.cust_id)}>
                                    <FiEdit color="#4C6FE6" size={20} />
                                </button>
                                <button className='modify-btn' onClick={() => handleDelete(value.cust_id, value.cust_name)}>

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
            {deleteParams.type && <Notification text={deleteParams.message} type={deleteParams.type} />}
            {deleteModal && <Modal><Confirm content={deleteParams.customer_name} delete={deleteFromDB} closeModal={closeModal} /></Modal>}
            {modifyModal && <Modal><AddCustomer closeHandler={closeModal} reloadHandler={forceReload} id={modifyParams} /></Modal>}
            <div>{content}</div>
        </div>

    )
}

export default CustomerContent
