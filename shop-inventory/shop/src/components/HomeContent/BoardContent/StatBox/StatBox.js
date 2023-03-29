import React from 'react'
import './StatBox.css'
const StatBox = (props) => {
    return (
        <div className={'stat-container ' + props.color}>
            <div className='stat-text'>
                <h1 className='stat-value'>{parseInt(props.value) / 10 >= 1 ? props.value : "0" + props.value}</h1>
                <span className='statbox-heading'>{props.heading}</span>
            </div>
            <div className='stat-image-container'>
                {props.icon}
            </div>
        </div>
    )
}

export default StatBox
