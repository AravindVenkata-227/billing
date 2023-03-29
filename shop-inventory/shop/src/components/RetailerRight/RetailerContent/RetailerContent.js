import React, { useState, useEffect } from 'react'
import $ from 'jquery'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBinLine } from 'react-icons/ri'
import api from '../../../api/api';
import Loading from '../../UIElements/Loading/Loading';
import Notification from '../../UIElements/Notification/Notification';
import Modal from '../../UIElements/Modal/Modal';
import Confirm from './../../UIElements/Confirm/Confirm';
import AddRetailer from '../../UIElements/AddRetailer/AddRetailer';
import NetworkError from '../../UIElements/NetworkError/NetworkError';
const RetailerContent = () => {

    const [state, setState] = useState([])

    const [isLoading, setLoading] = useState(false)
    const [networkError, setNetworkError] = useState(false)

    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteParams, setDeleteParams] = useState({})
    const [reload, setReload] = useState(0)
    const [modifyModal, setModifyModal] = useState(false)
    const [modifyParams, setModifyParams] = useState()
    const forceReload = () => {
        setReload((prev) => prev + 1)
    };
    const handleDelete = (id, retailer_name) => {
        setDeleteParams({
            id,
            retailer_name
        })
        setDeleteModal(true)
    }

    const closeModal = () => {
        setDeleteModal(false)
        setModifyModal(false)
    }

    const handleModify = (id) => {
        setModifyParams(id)
        setModifyModal(true)
    }
    const getRetailers = () => {
        api.get('/fetch/retailers')
            .then(function (response) {
                setState(response.data)
            })
            .catch(function (error) {
                setNetworkError(true)
            }).then(() => {
                setLoading(false)
                $('#retailers-table').DataTable();
                $('input[type="search"]')[0].placeholder = "Search"
                $('input[type="search"]')[0].previousSibling.textContent = '';
            })
    }

    const deleteFromDB = () => {
        setDeleteModal(false)
        api.delete(`/delete/delete_retailer/${deleteParams.id}`)
            .then(() => {
                setDeleteParams({ ...deleteParams, message: deleteParams.retailer_name + ' deleted successfully', type: 'success' })
                forceReload()

            })
            .catch((error) => {
                setDeleteParams({ ...deleteParams, message: ' Unable to delete ' + deleteParams.retailer_name, type: 'danger' })
            }).then(() => {
                setTimeout(() => {
                    setDeleteParams({})
                }, 2000);
            })
    }

    useEffect(() => {
        setLoading(true)
        getRetailers()
    }, [reload])



    let content
    if (isLoading)
        content = <Loading />
    else {
        content = <table className='table-content' id="retailers-table">
            <thead>
                <tr className='table-heading'>
                    <td>ID</td>
                    <td>Retailer Name</td>
                    <td>Address</td>
                    <td>Mobile Number</td>
                    <td>Email Address</td>
                    <td>Modify</td>
                </tr>
            </thead>
            <tbody>
                {state.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.ret_name}</td>
                            <td>{item.address}</td>
                            <td>{item.mobile_no}</td>
                            <td>{item.email}</td>
                            <td>
                                <button className='modify-btn' onClick={() => handleModify(item.ret_id)}>
                                    <FiEdit color="#4C6FE6" size={20} />
                                </button>
                                <button className='modify-btn' onClick={() => handleDelete(item.ret_id, item.ret_name)}>
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
            {deleteModal && <Modal><Confirm content={deleteParams.retailer_name} delete={deleteFromDB} closeModal={closeModal} /></Modal>}
            {modifyModal && <Modal><AddRetailer closeHandler={closeModal} reloadHandler={forceReload} id={modifyParams} /></Modal>}
            <div>{content}</div>
        </div>
    )
}

export default RetailerContent
