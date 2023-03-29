import React, { useEffect, useState } from 'react'
import { BsPeople } from 'react-icons/bs'
import AddCustomer from '../UIElements/AddCustomer/AddCustomer'
import Button from '../UIElements/Button/Button'
import Notification from '../UIElements/Notification/Notification'
import TopNav from '../UIElements/TopNav/TopNav'
import CustomerContent from './CustomerContent/CustomerContent'

const CustomerRight = () => {
    const [customerModal, setCustomerModal] = useState(false)
    const [reload, setReload] = useState(0)

    const forceReload = () => {
        setReload(prev => prev + 1)
    };
    const openCustomerModal = () => {
        closeModal()
        setCustomerModal(true)
    }

    const closeModal = () => {
        setCustomerModal(false)
    }

    return (
        <div key={reload}>
            {customerModal && <AddCustomer closeHandler={closeModal} reloadHandler={forceReload} />}
            <div className='customer-right'>
                <TopNav heading="Customers" content={<Button icon={<BsPeople size="20px" color="#fff" />} handler={openCustomerModal} text="Add Customer" />} />
                <CustomerContent />
            </div>
        </div>
    )
}

export default CustomerRight
