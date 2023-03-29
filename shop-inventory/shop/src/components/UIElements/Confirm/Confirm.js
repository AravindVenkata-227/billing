import React from 'react'
import './Confirm.css'
const Confirm = (props) => {
    return (
        <div className='confirm-container'>
            <h3 className='confirm-text'>Are you sure you want to delete {props.content}?</h3>
            <div className='confirm-btn-container'>
                <button className='confirm-btn btn-yes' onClick={props.delete}>Yes</button>
                <button className='confirm-btn btn-no' onClick={props.closeModal}>No</button>
            </div>

        </div>
    )
}

export default Confirm
