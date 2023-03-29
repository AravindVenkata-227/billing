import React from 'react'
import { useEffect, useState } from 'react';
import $ from 'jquery'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBinLine } from 'react-icons/ri'
import Loading from '../../UIElements/Loading/Loading';
import api from '../../../api/api';
import Modal from './../../UIElements/Modal/Modal';
import Confirm from './../../UIElements/Confirm/Confirm';
import Notification from './../../UIElements/Notification/Notification';
import AddItem from '../../UIElements/AddItem/AddItem';
import NetworkError from '../../UIElements/NetworkError/NetworkError';
import baseURL from '../../../api/baseURL';
const ProductContent = () => {

    const [state, setState] = useState([])

    const [isLoading, setLoading] = useState(false)
    const [networkError, setNetworkError] = useState(false)

    const [notification, setNotification] = useState({
        state: 'off',
        message: "",
        type: ''
    })

    const [deleteModal, setDeleteModal] = useState(false)

    const [modifyModal, setModifyModal] = useState(false)
    const [viewImage, setViewImage] = useState(false)

    const [deleteParams, setDeleteParams] = useState({})
    const [modifyParams, setModifyParams] = useState()

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
        setViewImage(false)
        setDeleteModal(false)
        setModifyModal(false)
    }

    const openImage = (url) => {
        setViewImage(url)
    }

    const getProducts = () => {
        api.get('/fetch/items')
            .then(function (response) {
                setState(response.data)
            })
            .catch(function (error) {
                setNetworkError(true)
            }).then(() => {
                setLoading(false)
                $('#products-table').DataTable();
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

    const [reload, setReload] = useState(0)

    const forceReload = () => {
        setReload((prev) => prev + 1)
    };

    useEffect(() => {
        setLoading(true)
        getProducts()

    }, [reload])

    useEffect(() => {
        if (notification.state === 'on') {
            forceReload()
            setTimeout(() => {
                setNotification({
                    state: 'off',
                    message: '',
                    type: ''
                })
            }, 2000);
        }
    }, [notification])

    let content
    if (isLoading)
        content = <Loading />
    else {
        content = <table className='table-content' id="products-table">
            <thead>
                <tr className='table-heading'>
                    <td>Picture</td>
                    <td>Product</td>
                    <td>Category</td>
                    <td>Wholesaler</td>
                    <td>Stock</td>
                    <td>Buy Price</td>
                    <td>MRP</td>
                    <td>Modify</td>
                </tr>
            </thead>
            <tbody>
                {state.map((value, index) => (
                    <tr key={index}>
                        <td><img className="product-image" onClick={(e) => openImage(e.target.src)} src={value.image === '' ? 'https://www.pngkey.com/png/full/233-2332677_image-500580-placeholder-transparent.png' : baseURL + "/uploads/" + value.image} alt={value.item_name} /></td>
                        <td>{value.item_name}</td>
                        <td>{value.category_name}</td>
                        <td>{value.ret_name}</td>
                        <td>{value.stock}</td>
                        <td>{value.wholesale}</td>
                        <td>{value.price}</td>
                        <td className='product-action'>
                            <button className='modify-btn' onClick={() => handleModify(value.item_id)} >
                                <FiEdit color="#4C6FE6" size={20} />
                            </button>
                            <button className='modify-btn' onClick={() => handleDelete(value.item_id, value.item_name)}>

                                <RiDeleteBinLine color="#ED374E" size={20} />
                            </button>
                        </td>
                    </tr>
                )
                )
                }
            </tbody>
        </table>
    }
    return (
        <div key={reload}>
            {viewImage && <Modal><div className='image-show-container'><img className="product-image-show" src={viewImage} /><span className='close-image' onClick={closeModal}>X</span></div></Modal>}
            {networkError && <NetworkError />}
            {notification.state === "on" ? <Notification text={notification.message} type={notification.type} /> : null}
            {deleteParams.type && <Notification text={deleteParams.message} type={deleteParams.type} />}
            {deleteModal && <Modal><Confirm content={deleteParams.item_name} delete={deleteFromDB} closeModal={closeModal} /></Modal>}
            {modifyModal && <Modal><AddItem closeHandler={closeModal} reloadHandler={forceReload} id={modifyParams} /></Modal>}
            <div>{content}</div>

        </div>
    )
}

export default ProductContent
