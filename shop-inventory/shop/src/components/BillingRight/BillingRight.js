import React from 'react'
import TopNav from '../UIElements/TopNav/TopNav'
// import RetailerContent from './Retailer'
import BillingContent from './BillingContent/BillingContent'
const BillingRight = () => {
    return (
        <div>
            <TopNav heading="Billing" />
            <BillingContent />
        </div>
    )
}

export default BillingRight
