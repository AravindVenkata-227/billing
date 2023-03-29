import React from 'react'
import './TopNav.css'

const TopNav = (props) => {
    return (
        <div className='top-nav'>
            <div className='nav-left'>
                <span className='nav-heading'>{props.heading}</span>
                <span className='nav-date'>{new Date().toLocaleDateString('en-in')}</span>
            </div>
            {props.content}
        </div>
    )
}

export default TopNav
