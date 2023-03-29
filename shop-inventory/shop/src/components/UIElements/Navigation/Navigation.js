import React from 'react'
import './Navigation.css'
import { AiOutlineHome } from 'react-icons/ai';
import { BiShoppingBag } from 'react-icons/bi';
import { BsPeople } from 'react-icons/bs';
import { FiTruck, FiLogOut } from 'react-icons/fi';
import { BsCashStack, BsCartX, BsBuilding } from 'react-icons/bs';
import { HiOutlineTicket } from 'react-icons/hi';
import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

const Navigation = () => {
    const navigate = useNavigate()
    const logoutHandler = () => {
        localStorage.removeItem('auth')
        navigate('/')
    }

    return (
        <div className='navigation'>
            <Link to="/dashboard/home">
                <div className='company'>
                    <BsBuilding color="#407EF4" size="20" />
                    <span className='company-name'>DKart</span>
                </div>
            </Link>
            <ul className='nav-container'>
                <li className='nav-item'>
                    <NavLink to='/dashboard/home' className="nav-link">
                        <AiOutlineHome color="#32B7B7" size="20px" />
                        <span className='nav-text'>Dashboard</span>
                    </NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink to='/dashboard/billing' className="nav-link">
                        <HiOutlineTicket color="#E79839" size="20px" />
                        <span className='nav-text'>Billing</span>
                    </NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink to='/dashboard/products' className="nav-link">
                        <BiShoppingBag color="#4C6FE6" size="20px" />
                        <span className='nav-text'>Products</span>
                    </NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink to='/dashboard/customers' className="nav-link">
                        <BsPeople color="#45CF25" size="20px" />
                        <span className='nav-text'>Customers</span>
                    </NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink to='/dashboard/retailers' className="nav-link">
                        <FiTruck color="#DB4B90" size="20px" />
                        <span className='nav-text'>Wholesaler</span>
                    </NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink to='/dashboard/bills' className="nav-link">
                        <BsCashStack color="#E79839" size="20px" />
                        <span className='nav-text'>Bills</span>
                    </NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink to='/dashboard/out_of_stock' className="nav-link">
                        <BsCartX color="#B74CE0" size="20px" />
                        <span className='nav-text'>Low Of Stock</span>
                    </NavLink>
                </li>
            </ul>
            <li className='nav-item' onClick={logoutHandler}>
                <FiLogOut color="#FF0000" size="20px" />
                <span className='nav-text'>Logout</span>

            </li>
        </div>
    )
}

export default Navigation
