import React from 'react'
import './Button.css'
const Button = (props) => {
    return (
        <button className='button' onClick={props.handler}>
            <span className='button-icon'>
                {props.icon}
            </span>
            {props.text}
        </button>
    )
}
export default Button
