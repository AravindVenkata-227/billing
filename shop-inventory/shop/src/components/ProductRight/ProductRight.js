import React, { useEffect, useState } from 'react'
import { BiShoppingBag } from 'react-icons/bi'
import AddItem from '../UIElements/AddItem/AddItem'
import Button from '../UIElements/Button/Button'
import TopNav from '../UIElements/TopNav/TopNav'
import ProductContent from './ProductContent/ProductContent'
const ProductRight = () => {
    const [itemModal, setItemModal] = useState(false)
    const [reload, setReload] = useState(0)

    const forceReload = () => {
        setReload(prev => prev + 1)
    };
    const openItemModal = () => {
        closeModal()
        setItemModal(true)
    }

    const closeModal = () => {
        setItemModal(false)
    }



    return (
        <div key={reload}>
            {itemModal && <AddItem closeHandler={closeModal} reloadHandler={forceReload} />}
            <div className='product-right'>
                <TopNav heading="Products" content={<Button icon={<BiShoppingBag size="20px" color="#fff" />} handler={openItemModal} text="Add Product" />} />
                <ProductContent />
            </div>
        </div>
    )
}

export default ProductRight
