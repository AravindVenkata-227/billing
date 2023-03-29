import React from 'react'
import { useEffect, useState } from 'react';
import $ from 'jquery'
import { RiDeleteBinLine } from 'react-icons/ri'
import { AiOutlineSave } from 'react-icons/ai'
import { BiPlusCircle } from 'react-icons/bi'
import './BillingContent.css'
import api from '../../../api/api';
import Loading from '../../UIElements/Loading/Loading';
import Button from '../../UIElements/Button/Button';
import Modal from '../../UIElements/Modal/Modal';
import ItemSelect from '../ItemSelect/ItemSelect';
import BillPanel from '../BillPanel/BillPanel';
import Notification from '../../UIElements/Notification/Notification';
const BillingContent = () => {
    const [data, setData] = useState([]);
    const [itemsModal, setItemsModal] = useState(false);
    const [billPanelModal, setBillPanelModal] = useState(false);

    const [reload, setReload] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const [isLoading, setLoading] = useState(false)
    const [notification, setNotification] = useState({
        state: 'off',
        message: "",
        type: ''
    })
    const forceReload = () => {
        setReload((prev) => prev + 1)
    };



    const removeHandler = (index) => {
        let newData = data.filter((value, i) => i !== index);
        setTotalPrice(totalPrice - data[index].total_price)
        setData(newData)
    }


    const changeHandler = (e, id, stock) => {
        if (e.target.value > stock)
            e.target.value = stock
        setData(prev => {
            prev[id].quantity = parseInt(e.target.value) ? parseInt(e.target.value) : "";
            prev[id].total_price = parseInt(e.target.value) ? parseInt(e.target.value) * prev[id].price : 0
            return [
                ...prev,
            ]
        })
    }

    const searchItemHandler = (e) => {
        setLoading(true)
        var count = 0;
        if (e.target.value === '')
            return
        else {
            api.get(`/search/items_in_stock/${e.target.value}`)
                .then(function (response) {
                    const results = response.data.results[0]
                    setData((prev) => {
                        count += 1
                        const found = prev.findIndex(el => el.item_id === results.item_id);
                        if (found === -1)
                            return [
                                ...prev,
                                {
                                    item_id: results.item_id,
                                    item_name: results.item_name,
                                    stock: results.stock,
                                    price: results.price,
                                    quantity: 1,
                                    total_price: results.price
                                }
                            ]
                        if (count === 1) {
                            if (prev[found].quantity < prev[found].stock) {
                                prev[found].quantity = prev[found].quantity + 1
                                prev[found].total_price = prev[found].quantity * prev[found].price
                                setTotalPrice(previous => previous + prev[found].price)
                                setTotalItems(previous => previous + 1)
                            }
                        }
                        return prev

                    })
                    forceReload()
                })
                .catch(function (error) {
                }).then(() => {
                    setLoading(false)
                })
        }
    }

    useEffect(() => {
        var totalPrice = 0
        var totalItems = 0
        data.map(item => {
            totalPrice += item.total_price
            totalItems += item.quantity
            return 0
        }
        )
        setTotalPrice(totalPrice)
        setTotalItems(totalItems)
    }, [data])

    useEffect(() => {
        $('#billing-table').DataTable(
            {
                searching: false,
                lengthChange: false,
                paging: false,
                info: false,
                language: {
                    emptyTable: "Bill is empty. Please add items to bill."
                }
            });
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

    const addItemHandler = () => {
        setItemsModal(true)
    }

    const closeItemsModal = () => {
        forceReload()
        setItemsModal(false)
    }
    const closeBillPanelModal = () => {
        setBillPanelModal(false)
    }

    const saveBillHandler = () => {
        setBillPanelModal(true)
    }

    return (
        <div className="item-modal-container" key={reload}>
            {notification.state === "on" ? <Notification text={notification.message} type={notification.type} /> : null}
            {itemsModal && <Modal>
                <ItemSelect handler={setData} force={forceReload} close={closeItemsModal} totalPriceHandler={setTotalPrice} totalItemsHandler={setTotalItems} />
            </Modal>}
            {billPanelModal && <Modal>
                <BillPanel state={data} total_price={totalPrice} force={forceReload} stateHandler={setData} total_items={totalItems} close={closeBillPanelModal} setNotification={setNotification} />
            </Modal>}
            {isLoading && <Loading />}
            <div className='billing-actions'>
                <div className="action-container">
                    <input type="text" placeholder="Search" className='item-search' onChange={searchItemHandler} />
                    <button className='additem-button' onClick={addItemHandler}>
                        <span className='button-icon'><BiPlusCircle size={20} color="#4C6FE6" /></span>
                        Add Product
                    </button>
                </div>
                <div className="addbill-container">
                    <Button icon={<AiOutlineSave color="#fff" size={20} />} text="Save Bill" handler={saveBillHandler} />
                </div>
            </div>

            <table className='table-content' id="billing-table">
                <thead>
                    <tr className='table-heading'>
                        <td>ID</td>
                        <td>Product Name</td>
                        <td>Available Stock</td>
                        <td>Quantity</td>
                        <td>Price</td>
                        <td>Total Price</td>
                        <td>Modify</td>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.item_name}</td>
                                <td>{item.stock}</td>
                                <td><input type="number" min="1" max={item.stock} value={item.quantity} className='quantity' onChange={(e) => changeHandler(e, index, item.stock)} /></td>
                                <td>{item.price}</td>
                                <td>{item.total_price}</td>
                                <td>
                                    <button className='modify-btn' onClick={() => removeHandler(index)}>
                                        <RiDeleteBinLine color="#ED374E" size={20} />
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <div className='billing-results'>
                <div className='billing-total-items billing-item'>Total Items: <span className='colored'>{totalItems}</span></div>
                <div className='billing-total-price billing-item'>Total Price: <span className='colored'>{totalPrice}</span></div>
            </div>
        </div>
    )
}

export default BillingContent
