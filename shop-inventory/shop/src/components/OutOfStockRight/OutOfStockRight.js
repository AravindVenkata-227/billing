import React from 'react'
import TopNav from '../UIElements/TopNav/TopNav'
// import RetailerContent from './Retailer'
import OutOfStockContent from './OutOfStockContent/OutOfStockContent'
const ProductRight = () => {
    return (
        <div>
            <TopNav heading="Low of Stock" />
            <OutOfStockContent />
        </div>
    )
}

export default ProductRight
