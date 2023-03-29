import React from 'react'
import TopNav from '../UIElements/TopNav/TopNav'
// import RetailerContent from './Retailer'
import BillsContent from './BillsContent/BillsContent'
const ProductRight = () => {
    return (
        <div>
            <TopNav heading="Bills" button />
            <BillsContent />
        </div>
    )
}

export default ProductRight
