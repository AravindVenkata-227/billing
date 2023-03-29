import React from 'react'
import { useEffect, useState } from 'react';
import $ from 'jquery'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBinLine } from 'react-icons/ri'
import api from '../../../api/api';
import Loading from '../../UIElements/Loading/Loading';
import Notification from '../../UIElements/Notification/Notification';
import Confirm from '../../UIElements/Confirm/Confirm';
import Modal from './../../UIElements/Modal/Modal';
import AddItem from '../../UIElements/AddItem/AddItem';
import NetworkError from '../../UIElements/NetworkError/NetworkError';

const OutOfStockContent = () => {

    const [state, setState] = useState([])

    const [isLoading, setLoading] = useState(false)
    const [networkError, setNetworkError] = useState(false)

    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteParams, setDeleteParams] = useState({})
    const [reload, setReload] = useState(0)
    const [notification, setNotification] = useState({
        state: 'off',
        message: "",
        type: ''
    })

    const [modifyModal, setModifyModal] = useState(false)
    const [modifyParams, setModifyParams] = useState()



    const forceReload = () => {
        setReload((prev) => prev + 1)
    };



    const handleDelete = (id, item_name) => {
        setDeleteParams({
            id,
            item_name
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

    const getOos = () => {
        api.get('/fetch/out_of_stock')
            .then(function (response) {
                setState(response.data)
            })
            .catch(function (error) {
                setNetworkError(true)
            }).then(() => {
                setLoading(false)
                $('#oof-table').DataTable();
                $('input[type="search"]')[0].placeholder = "Search"
                $('input[type="search"]')[0].previousSibling.textContent = '';
            })
    }

    const deleteFromDB = () => {
        setDeleteModal(false)
        api.delete(`/delete/delete_items/${deleteParams.id}`)
            .then(() => {
                setDeleteParams({ ...deleteParams, message: deleteParams.item_name + ' deleted successfully', type: 'success' })
                forceReload()

            })
            .catch((error) => {
                setDeleteParams({ ...deleteParams, message: ' Unable to delete ' + deleteParams.item_name, type: 'danger' })
            }).then(() => {
                setTimeout(() => {
                    setDeleteParams({})
                }, 2000);
            })
    }


    useEffect(() => {
        setLoading(true)
        getOos()
    }, [reload])

    useEffect(() => {
        if (notification.state === 'on') {
            setTimeout(() => {
                setNotification({
                    state: 'off',
                    message: '',
                    type: ''
                })
            }, 2000);
            forceReload()
        }
    }, [notification])

    let content
    if (isLoading)
        content = <Loading />
    else {
        content = <table className='table-content' id="oof-table">
            <thead>
                <tr className='table-heading'>
                    <td>ID</td>
                    <td>Product Name</td>
                    <td>Wholesaler</td>
                    <td>Mobile Number</td>
                    <td>Email Address</td>
                    <td>Buy Price</td>
                    <td>Modify</td>
                </tr>
            </thead>
            <tbody>
                {state.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.item_name}</td>
                            <td>{item.ret_name}</td>
                            <td>{item.mobile_no}</td>
                            <td>{item.email}</td>
                            <td>{item.wholesale}</td>
                            <td>
                                <button className='modify-btn' onClick={() => handleModify(item.item_id)}>
                                    <FiEdit color="#4C6FE6" size={20} />
                                </button>
                                <button className='modify-btn' onClick={() => handleDelete(item.item_id, item.item_name)}>

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
            {content}
            {notification.state === "on" ? <Notification text={notification.message} type={notification.type} /> : null}
            {deleteParams.type && <Notification text={deleteParams.message} type={deleteParams.type} />}
            {deleteModal && <Modal><Confirm content={deleteParams.item_name} delete={deleteFromDB} closeModal={closeModal} /></Modal>}
            {modifyModal && <Modal><AddItem closeHandler={closeModal} reloadHandler={forceReload} id={modifyParams} /></Modal>}

        </div>
    )
}

export default OutOfStockContent
