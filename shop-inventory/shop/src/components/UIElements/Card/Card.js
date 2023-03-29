import React from 'react'
import Modal from '../Modal/Modal'
import './Card.css'
const Card = (props) => {
    return (
        <Modal>
            <div className='card'>
                <h3 className='card-heading'>{props.heading}</h3>
                <div className='card-content'>
                    {props.children}
                </div>
                <div className='card-btns'>
                    <button className='card-close' onClick={props.close}>Close</button>
                    <button className='card-save' onClick={props.submitHandler}>Save</button>
                </div>
            </div>
        </Modal>
    )
}

export default Card
