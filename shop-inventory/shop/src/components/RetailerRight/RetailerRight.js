import React, { useEffect, useState } from 'react'
import { FiTruck } from 'react-icons/fi'
import AddRetailer from '../UIElements/AddRetailer/AddRetailer'
import TopNav from '../UIElements/TopNav/TopNav'
import RetailerContent from './RetailerContent/RetailerContent'
import Button from '../UIElements/Button/Button'


const RetailerRight = () => {
    const [retailerModal, setRetailerModal] = useState(false)

    const [reload, setReload] = useState(0)

    const forceReload = () => {
        setReload(prev => prev + 1)
    };
    const openRetailerModal = () => {
        closeModal()
        setRetailerModal(true)
    }

    const closeModal = () => {
        setRetailerModal(false)
    }

    return (
        <div key={reload}>
            {retailerModal && <AddRetailer closeHandler={closeModal} reloadHandler={forceReload} />}

            <div>
                <TopNav heading="Retailers" content={<Button icon={<FiTruck size="20px" color="#fff" />} handler={openRetailerModal} text="Add Retailer" />} />
                <RetailerContent />
            </div>
        </div>
    )
}

export default RetailerRight
