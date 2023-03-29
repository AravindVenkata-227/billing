import React, { useEffect, useState } from 'react'
import StatBox from './StatBox/StatBox'
import './BoardContent.css'
import { BiShoppingBag } from 'react-icons/bi';
import { FaRupeeSign } from 'react-icons/fa';
import { BsCartX, BsPeople } from 'react-icons/bs';
import { FiAlertCircle, FiTruck } from 'react-icons/fi';
import { GrTicket } from 'react-icons/gr';
import { BiCategory } from 'react-icons/bi';
import api from '../../../api/api'
import Loading from '../../UIElements/Loading/Loading';
import QuickLink from '../../UIElements/QuickLink/QuickLink'
import Modal from './../../UIElements/Modal/Modal';
import AddItem from '../../UIElements/AddItem/AddItem';
import Notification from '../../UIElements/Notification/Notification';
import AddCustomer from '../../UIElements/AddCustomer/AddCustomer';
import AddRetailer from '../../UIElements/AddRetailer/AddRetailer';
import AddCategory from '../../UIElements/AddCategory/AddCategory';
import { Link } from 'react-router-dom'
import NetworkError from '../../UIElements/NetworkError/NetworkError';
const BoardContent = () => {
    const [state, setstate] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [networkError, setNetworkError] = useState(false)
    const [summaryToday, setSummeryToday] = useState({
        "sales_today": 0,
        "items_today": 0,
        "revenue_today": 0,
        "out_of_stock": 0,
        "low_stock": 0,
        "customer_count": 0
    })
    const [totalSummary, setTotalSummary] = useState({
        "customer": 0,
        "retailer": 0,
        "items": 0,
        "revenue": 0
    })

    const [modalState, setModalState] = useState({
        addItem: false,
        addCustomer: false,
        addCategory: false,
        addRetailer: false,
    })

    const [reload, setReload] = useState(0)

    const openItemModal = () => {
        closeModal()
        setModalState({
            ...modalState,
            addItem: true,
        })
    }

    const openCustomerModal = () => {
        closeModal()
        setModalState({
            ...modalState,
            addCustomer: true,
        })
    }

    const openRetailerModal = () => {
        closeModal()
        setModalState({
            ...modalState,
            addRetailer: true,
        })
    }

    const openCategoryModal = () => {
        closeModal()
        setModalState({
            ...modalState,
            addCategory: true,
        })
    }

    const closeModal = () => {
        setModalState({
            ...modalState,
            addItem: false,
            addRetailer: false,
            addCustomer: false,
            addCategory: false
        })
    }

    useEffect(() => {
        setLoading(true)
        var count = 0
        api.get('/fetch/best_sellers')
            .then(function (response) {
                setstate(response.data)
            })
            .catch(function (error) {
                setNetworkError(true)
            }).then(() => {
                count++;
            })

        api.get('/fetch/info_today')
            .then(function (response) {
                setSummeryToday(response.data)
            })
            .catch(function (error) {
                setNetworkError(true)
            }).then(() => {
                count++;
            })

        api.get('/fetch/info')
            .then(function (response) {
                setTotalSummary(response.data)
                setLoading(false)
            })
            .catch(function (error) {
                setNetworkError(true)
            }).then(() => {
                count++;
            })
        if (count === 3)
            setLoading(false)
    }, [reload])

    const forceReload = () => {
        setReload((prev) => prev + 1)
    };

    let content
    if (isLoading)
        content = <Loading />
    else {
        content = <div className='board-content' key={reload}>
            <div className='board-first'>
                <StatBox icon={<FaRupeeSign color="rgb(69, 207, 37)" />} heading="Total Revenue" value={totalSummary.revenue} color="green" />
                <StatBox icon={<BsPeople color="#E79839" />} heading="Customers" value={totalSummary.customer} color="orange" />
                <StatBox icon={<BiShoppingBag color="#4C6FE6" />} heading="Products" value={totalSummary.items} color="blue" />
                <StatBox icon={<FiTruck color="#DB4B90" />} heading="Retailer" value={totalSummary.retailer} color="red" />
            </div>
            <div className='board-middle'>
                <div className='card-container'>
                    <div className='card-header'>
                        <h3 className='board-heading'>Best Sellers</h3>
                        <div className='more'>
                            <Link to='/dashboard/products'> More</Link>
                        </div>
                    </div>
                    <table className='bestseller-table'>
                        <thead className='bestseller-table-head'>
                            <tr>
                                <td>Product</td>
                                <td>Price</td>
                                <td>Stock</td>
                                <td>Revenue</td>
                            </tr>
                        </thead>
                        <tbody className='bestseller-table-body'>
                            {
                                state.map(value => (
                                    <tr key={value.item_name}>
                                        <td>{value.item_name}</td>
                                        <td>{value.price}</td>
                                        <td>{value.stock}</td>
                                        <td>{value.total_revenue}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                        <tbody>

                        </tbody>
                    </table>
                </div>
                <div className='card-container'>
                    <div className='card-header'>
                        <h3 className='board-heading summary-header'>Today's Summary</h3>
                    </div>
                    <div className='summary-container'>
                        <div className='summary-row'>
                            <div className='summary-row-icon icon-bg-1'>
                                <BsPeople />
                            </div>
                            <div className='summary-row-text'>
                                Number of customers visited
                            </div>
                            <div className='summary-row-value'>
                                {summaryToday.customer_count}
                            </div>
                        </div>
                        <div className='summary-row'>
                            <div className='summary-row-icon icon-bg-2'>
                                <BiShoppingBag />
                            </div>
                            <div className='summary-row-text'>
                                Number of items sold
                            </div>
                            <div className='summary-row-value'>
                                {summaryToday.items_today}
                            </div>
                        </div>
                        <div className='summary-row'>
                            <div className='summary-row-icon icon-bg-3'>
                                <FaRupeeSign />
                            </div>
                            <div className='summary-row-text'>
                                Total transaction
                            </div>
                            <div className='summary-row-value'>
                                {summaryToday.revenue_today}
                            </div>
                        </div>
                        <div className='summary-row'>
                            <div className='summary-row-icon icon-bg-4'>
                                <BsCartX />
                            </div>
                            <div className='summary-row-text'>
                                Out of Stock
                            </div>
                            <div className='summary-row-value'>
                                {summaryToday.out_of_stock}
                            </div>
                        </div>
                        <div className='summary-row'>
                            <div className='summary-row-icon icon-bg-5'>
                                <FiAlertCircle />
                            </div>
                            <div className='summary-row-text'>
                                Low of Stock
                            </div>
                            <div className='summary-row-value'>
                                {summaryToday.low_stock}
                            </div>
                        </div>
                        <div className='summary-row'>
                            <div className='summary-row-icon icon-bg-6'>
                                <GrTicket />
                            </div>
                            <div className='summary-row-text'>
                                Total bills genereated
                            </div>
                            <div className='summary-row-value'>
                                {summaryToday.sales_today}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='board-last'>
                <QuickLink buttonText='Add Product' handler={openItemModal} icon={<BiShoppingBag size="20px" color="#4C6FE6" />} />
                <QuickLink buttonText='Add Customer' handler={openCustomerModal} icon={<BsPeople size="20px" color="#45CF25" />} />
                <QuickLink buttonText='Add Wholesaler' handler={openRetailerModal} icon={<FiTruck size="20px" color="#DB4B90" />} />
                <QuickLink buttonText='Add Category' handler={openCategoryModal} icon={<BiCategory size="20px" color="#E69839" />} />
            </div>
        </div>
    }

    return (
        <>
            {networkError && <NetworkError />}
            {(modalState.addItem || modalState.addCustomer || modalState.addRetailer || modalState.addCategory) && <Modal>
                {modalState.addItem && <AddItem closeHandler={closeModal} reloadHandler={forceReload} />}
                {modalState.addCustomer && <AddCustomer closeHandler={closeModal} reloadHandler={forceReload} />}
                {modalState.addRetailer && <AddRetailer closeHandler={closeModal} reloadHandler={forceReload} />}
                {modalState.addCategory && <AddCategory closeHandler={closeModal} reloadHandler={forceReload} />}
            </Modal>}
            <div>{content}</div>
        </>
    )
}

export default BoardContent
