import Loading from '../UIElements/Loading/Loading'
import React, { Suspense, useEffect } from 'react'
import Navigation from '../UIElements/Navigation/Navigation'
import { Route, Routes } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

import './Home.css'
import api from '../../api/api';

const HomeContent = React.lazy(() => import('./../HomeContent/HomeContent'))
const ProductRight = React.lazy(() => import('./../ProductRight/ProductRight'))
const CustomerRight = React.lazy(() => import('../CustomerRight/CustomerRight'))
const RetailerRight = React.lazy(() => import('../RetailerRight/RetailerRight'))
const BillsRight = React.lazy(() => import('../BillsRight/BillsRight'))
const OutOfStockRight = React.lazy(() => import('../OutOfStockRight/OutOfStockRight'))
const BillingRight = React.lazy(() => import('../BillingRight/BillingRight'))

const Home = () => {
    const navigate = useNavigate()
    useEffect(() => {
        if (localStorage.getItem('auth') === null)
            navigate('/')
        else {
            api.post('/auth/verify', { key: localStorage.getItem('auth') }).then((response) => {
            }).catch(() => {
                navigate('/')
            })
        }
    })
    return (

        <div className='home'>
            <Navigation />
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path='/home' exact end element={<HomeContent />} />
                    <Route path='/products' exact element={<ProductRight />} />
                    <Route path='/customers' exact element={<CustomerRight />} />
                    <Route path='/retailers' exact element={<RetailerRight />} />
                    <Route path='/bills' exact element={<BillsRight />} />
                    <Route path='/out_of_stock' exact element={<OutOfStockRight />} />
                    <Route path='/billing' exact element={<BillingRight />} />
                    <Route path='/' exact end element={<HomeContent />} />
                </Routes>
            </Suspense>
        </div>
    )
}

export default Home
