import React, { useEffect, useState } from 'react'
import api from '../../../api/api'
import Card from '../Card/Card'
const AddRetailer = (props) => {
    const [state, setState] = useState({
        retailer_name: "",
        address: "",
        phone_number: "",
        email: ""
    })

    const [error, setError] = useState({
        retailer_name: { errorstate: false, message: "" },
        address: false,
        phone_number: false,
        email: false,
    })
    const [saveLoader, setSaveLoader] = useState(false)


    useEffect(() => {
        if (props.id) {
            setSaveLoader({
                type: "loading-state",
                message: "Please wait..."
            })
            api.get(`/search/retailer/${props.id}`)
                .then(function (response) {
                    setSaveLoader(false)
                    setState(prev => ({
                        ...prev,
                        retailer_name: response.data.results[0].ret_name,
                        address: response.data.results[0].address,
                        phone_number: response.data.results[0].mobile_no,
                        email: response.data.results[0].email
                    }))
                })
                .catch(function (error) {
                    setSaveLoader({
                        type: "failure",
                        message: "Something went wrong! Please reload"
                    })
                })
        }
    }, [])

    const addRetailer = () => {
        setSaveLoader({
            type: "loading-state",
            message: "Please wait!!"
        })
        if (state.retailer_name.length > 0 && state.address.length > 0 && state.phone_number > 0 && state.email.length > 0) {
            setError(
                {
                    retailer_name: { errorstate: false, message: "" },
                    address: false,
                    phone_number: { errorstate: false, message: "" },
                    email: { errorstate: false, message: "" },
                }
            )
            if (props.id) {
                api.put(`update/update_retailer/${props.id}`, {
                    "retailer_name": state.retailer_name,
                    "address": state.address,
                    "mobile_no": state.phone_number,
                    "email": state.email
                }).then(() => {
                    setSaveLoader({
                        type: "data-success",
                        message: state.retailer_name + "  updated successfully"
                    })

                }).catch((error) => {
                    setSaveLoader(false)
                    if (error.response.data.code !== 'ER_DUP_ENTRY') {
                        setSaveLoader({
                            type: 'failure',
                            message: 'Failed to update ' + state.retailer_name
                        })
                    } else {
                        if (error.response.data.sqlMessage === "Duplicate entry '" + state.retailer_name + "' for key 'ret_name'")
                            setError(prev => ({ ...prev, retailer_name: { errorstate: true, message: "Retailer name already Exists" } }))
                        else if (error.response.data.sqlMessage === "Duplicate entry '" + state.phone_number + "' for key 'mobile_no'")
                            setError(prev => ({ ...prev, phone_number: { errorstate: true, message: "Mobile number already Exists" } }))
                        else if (error.response.data.sqlMessage === "Duplicate entry '" + state.email + "' for key 'email'")
                            setError(prev => ({ ...prev, email: { errorstate: true, message: "Email already Exists" } }))
                    }

                })
            } else {
                api.post('create/create_retailer', {
                    "name": state.retailer_name,
                    "address": state.address,
                    "phone": state.phone_number,
                    "email": state.email
                }).then(() => {
                    setSaveLoader({
                        type: "data-success",
                        message: state.retailer_name + " created successfully"
                    })
                    setState({
                        retailer_name: "",
                        address: "",
                        phone_number: "",
                        email: ""
                    })
                }).catch((error) => {
                    setSaveLoader(false)
                    if (error.response.data.code !== 'ER_DUP_ENTRY') {
                        setSaveLoader({
                            type: 'failure',
                            message: 'Failed to create ' + state.retailer_name
                        })
                    } else {
                        if (error.response.data.sqlMessage === "Duplicate entry '" + state.retailer_name + "' for key 'ret_name'")
                            setError(prev => ({ ...prev, retailer_name: { errorstate: true, message: "Wholesaler name already Exists" } }))
                        else if (error.response.data.sqlMessage === "Duplicate entry '" + state.phone_number + "' for key 'mobile_no'")
                            setError(prev => ({ ...prev, phone_number: { errorstate: true, message: "Mobile number already Exists" } }))
                        else if (error.response.data.sqlMessage === "Duplicate entry '" + state.email + "' for key 'email'")
                            setError(prev => ({ ...prev, email: { errorstate: true, message: "Email already Exists" } }))
                    }
                })
            }
        } else {
            setSaveLoader(false)
            state.retailer_name === "" ? setError((prev) => ({ ...prev, retailer_name: { errorstate: true, message: "Retailer name cannot be empty!" } })) : setError((prev) => ({ ...prev, retailer_name: { errorstate: false, message: "" } }))
            state.phone_number <= 0 ? setError((prev) => ({ ...prev, phone_number: { errorstate: true, message: "Mobile number cannot be empty!" } })) : setError((prev) => ({ ...prev, phone_number: { errorstate: false, message: "" } }))
            state.email === "" ? setError((prev) => ({ ...prev, email: { errorstate: true, message: "Email cannot be empty!" } })) : setError((prev) => ({ ...prev, email: { errorstate: false, message: "" } }))
            state.address === "" ? setError((prev) => ({ ...prev, address: true })) : setError((prev) => ({ ...prev, address: false }))
        }
    }

    const closeHandler = () => {
        if (saveLoader && saveLoader.type === 'data-success' && props.reloadHandler)
            props.reloadHandler();

        props.closeHandler();
    }
    return (
        <Card heading="Add Wholesaler" close={closeHandler} submitHandler={addRetailer}>
            {saveLoader && <div className={'current-state ' + saveLoader.type}>{saveLoader.message}</div>}
            <div className="form-group">
                <label htmlFor="retailer-name">Wholesaler Name</label>
                <input type="text" className={error.retailer_name.errorstate ? "form-item error-border" : 'form-item'} id="retailer-name" placeholder='Eg. John Doe' value={state.retailer_name} onChange={(e) => {
                    setState(prev => ({ ...prev, retailer_name: e.target.value }))
                    e.target.value === "" ? setError((prev) => ({ ...prev, retailer_name: { errorstate: true, message: "Wholesaler name cannot be empty" } })) : setError((prev) => ({ ...prev, retailer_name: { errorstate: false, message: "" } }))
                }} />
                {error.retailer_name.errorstate && <span className='input-error'>{error.retailer_name.message}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <input type="text" maxLength="10" value={state.phone_number === 0 ? "" : state.phone_number} className={error.phone_number.errorstate ? "form-item error-border" : 'form-item'} id="mobile" placeholder='Mobile number' onChange={(e) => {
                    setState(prev => ({ ...prev, phone_number: parseInt(e.target.value) ? parseInt(e.target.value) : 0 }))
                    e.target.value <= 0 ? setError((prev) => ({ ...prev, phone_number: { errorstate: true, message: "Mobile number cannot be emtpy!" } })) : setError((prev) => ({ ...prev, phone_number: { errorstate: false, message: "" } }))
                }} />
                {error.phone_number.errorstate && <span className='input-error'>{error.phone_number.message}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" value={state.email} className={error.email.errorstate ? "form-item error-border" : 'form-item'} id="email" placeholder='johndoe@gmail.com' onChange={(e) => {
                    setState(prev => ({ ...prev, email: e.target.value }))
                    e.target.value === "" ? setError((prev) => ({ ...prev, email: { errorstate: true, message: "Email cannot be empty!" } })) : setError((prev) => ({ ...prev, email: { errorstate: false, message: "" } }))
                }} />
                {error.email.errorstate && <span className='input-error'>{error.email.message}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea value={state.address} className={error.address ? "form-item error-border" : 'form-item'} id="address" placeholder='Retailer address' onChange={(e) => {
                    setState(prev => ({ ...prev, address: e.target.value }))
                    e.target.value === "" ? setError((prev) => ({ ...prev, address: true })) : setError((prev) => ({ ...prev, address: false }))
                }}>
                </textarea>
                {error.address && <span className='input-error'>Please enter address</span>}
            </div>

        </Card >
    )
}

export default AddRetailer
