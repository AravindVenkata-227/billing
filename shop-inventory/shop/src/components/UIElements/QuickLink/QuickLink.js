import React from 'react'
import './QuickLink.css'
const QuickLink = (props) => {

    return (
        <button className='add-button' onClick={props.handler}>
            <span className='button-icon'>{props.icon}</span>
            {props.buttonText}
        </button>
    )
}

export default QuickLink
