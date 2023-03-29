import React from 'react';
import './NetworkError.css'
const NetworkError = () => {
    const reloadHandler = () => {
        window.location.reload()
    }
    return <div className='network-error'>
        <div className='network-container'>
            Poor Internet Connection. <button className='reload' onClick={reloadHandler}>Reload</button>
        </div>
    </div>;
};

export default NetworkError;
