import React, { useEffect, useState } from 'react'
import api from '../../../api/api'
import Card from '../Card/Card'
const AddItem = (props) => {
    const [state, setState] = useState({
        id: "",
        product: "",
        category: [{
            id: 0,
            value: "Choose a category"
        }],
        wholesale: 0,
        categorySelected: 0,
        retailerSelected: 0,
        price: 0,
        stock: 0,
        retailer: [{
            id: 0,
            value: "Choose a retailer"
        }],
        file: ''

    })
    const [saveLoader, setSaveLoader] = useState(false)

    const [error, setError] = useState({
        id: { errorstate: false, message: "" },
        product: { errorstate: false, message: "" },
        category: false,
        wholesale: false,
        retailer: false,
        price: false,
        stock: false
    })

    useEffect(() => {
        var updatedState = { ...state }
        setSaveLoader({
            type: "loading-state",
            message: "Please wait..."
        })
        api.get('/fetch/categories')
            .then(function (response) {
                const initialCategory = [
                    {
                        id: 0,
                        value: "Choose a category"
                    }
                ]
                updatedState = { ...updatedState, category: [...initialCategory, ...response.data] }
                api.get('/fetch/retailers_select')
                    .then(function (response) {
                        const initialRetailer = [
                            {
                                id: 0,
                                value: "Choose a retailer"
                            }
                        ]
                        updatedState = { ...updatedState, retailer: [...initialRetailer, ...response.data] }
                        setState(updatedState)
                        setSaveLoader(false)
                        if (props.id) {
                            setSaveLoader({
                                type: "loading-state",
                                message: "Please wait..."
                            })
                            api.get(`/search/items/${props.id}`)
                                .then(function (response) {
                                    setState(prev => ({
                                        ...prev,
                                        id: response.data.results[0].product_id,
                                        product: response.data.results[0].item_name,
                                        wholesale: response.data.results[0].wholesale,
                                        categorySelected: response.data.results[0].cat_id,
                                        retailerSelected: response.data.results[0].ret_id,
                                        price: response.data.results[0].price,
                                        stock: response.data.results[0].stock,
                                        file: response.data.results[0].image
                                    }))
                                    setSaveLoader(false)
                                })
                                .catch(function (error) {
                                    setSaveLoader({
                                        type: "failure",
                                        message: "Something went wrong! Please reload"
                                    })
                                })
                        }

                    })
                    .catch(function (error) {
                        setSaveLoader({
                            type: "failure",
                            message: "Something went wrong! Please reload"
                        })
                    })
            })
            .catch(function (error) {
                console.log(error);
                setSaveLoader({
                    type: "failure",
                    message: "Something went wrong! Please reload"
                })
            })


    }, [])
    const addProduct = () => {
        setSaveLoader({
            type: "loading-state",
            message: "Please wait!!"
        })
        if (state.id !== "" && state.product !== "" && state.categorySelected > 0 && state.retailerSelected > 0 && state.price > 0 && state.stock > 0 && state.wholesale > 0) {
            setError(
                {
                    id: { errorstate: false, message: '' },
                    product: { errorstate: false, message: '' },
                    category: false,
                    wholesale: false,
                    retailer: false,
                    price: false,
                }
            )

            var formFields = {
                "product_id": state.id,
                "item_name": state.product,
                "stock": state.stock,
                "wholesale": state.wholesale,
                "price": state.price,
                "category_id": state.categorySelected,
                "retailer_id": state.retailerSelected,
                "product": state.file
            }

            var data_form = new FormData();
            for (var key in formFields) {
                data_form.append(key, formFields[key]);
            }
            if (props.id) {
                api.put(`update/update_items/${props.id}`, data_form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(() => {
                    setSaveLoader({
                        type: "data-success",
                        message: state.product + "  updated successfully"
                    })

                }).catch((error) => {
                    setSaveLoader(false)
                    if (error.response.data.code !== 'ER_DUP_ENTRY') {
                        setSaveLoader({
                            type: 'failure',
                            message: 'Failed to update ' + state.product
                        })
                    } else {
                        if (error.response.data.sqlMessage === "Duplicate entry '" + state.id + "' for key 'product_id'")
                            setError(prev => ({ ...prev, id: { errorstate: true, message: "Product ID already Exists" } }))
                        else if (error.response.data.sqlMessage === "Duplicate entry '" + state.product + "' for key 'item_name'")
                            setError(prev => ({ ...prev, product: { errorstate: true, message: "Product already Exists" } }))
                    }
                })
            } else {
                api.post('create/add_item', data_form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(() => {
                    setSaveLoader({
                        type: "data-success",
                        message: state.product + " added successfully"
                    })
                    setState({
                        id: "",
                        product: "",
                        category: [{
                            id: 0,
                            value: "Choose a category"
                        }],
                        wholesale: 0,
                        categorySelected: 0,
                        retailerSelected: 0,
                        price: 0,
                        stock: 0,
                        retailer: [{
                            id: 0,
                            value: "Choose a Wholesaler"
                        }],
                        file: ''

                    })


                }).catch((error) => {
                    setSaveLoader(false)
                    if (error.response.data.code !== 'ER_DUP_ENTRY') {
                        setSaveLoader({
                            type: 'failure',
                            message: 'Failed to create ' + state.product
                        })
                    } else {
                        if (error.response.data.sqlMessage === "Duplicate entry '" + state.id + "' for key 'product_id'")
                            setError(prev => ({ ...prev, id: { errorstate: true, message: "Product ID already Exists" } }))
                        else if (error.response.data.sqlMessage === "Duplicate entry '" + state.product + "' for key 'item_name'")
                            setError(prev => ({ ...prev, product: { errorstate: true, message: "Product already Exists" } }))
                    }

                })
            }
        } else {
            setSaveLoader(false)
            state.id === "" ? setError((prev) => ({ ...prev, id: { errorstate: true, message: "Product ID cannot be empty" } })) : setError((prev) => ({ ...prev, id: { errorstate: false, message: "" } }))
            state.product === "" ? setError((prev) => ({ ...prev, product: { errorstate: true, message: "Product name cannot be empty" } })) : setError((prev) => ({ ...prev, product: { errorstate: false, message: "" } }))
            state.categorySelected <= 0 ? setError((prev) => ({ ...prev, category: true })) : setError((prev) => ({ ...prev, category: false }))
            state.wholesale <= 0 ? setError((prev) => ({ ...prev, wholesale: true })) : setError((prev) => ({ ...prev, wholesale: false }))
            state.price <= 0 ? setError((prev) => ({ ...prev, price: true })) : setError((prev) => ({ ...prev, price: false }))
            state.stock <= 0 ? setError((prev) => ({ ...prev, stock: true })) : setError((prev) => ({ ...prev, stock: false }))
            state.retailerSelected <= 0 ? setError((prev) => ({ ...prev, retailer: true })) : setError((prev) => ({ ...prev, retailer: false }))

        }
    }

    const closeHandler = () => {
        if (saveLoader && saveLoader.type === 'data-success' && props.reloadHandler)
            props.reloadHandler();

        props.closeHandler();
    }
    return (
        <Card heading="Add Product" close={closeHandler} submitHandler={addProduct}>
            {saveLoader && <div className={'current-state ' + saveLoader.type}>{saveLoader.message}</div>}
            <div className="form-group">
                <label htmlFor="product-id">Product ID</label>
                <input type="text" className={error.id.errorstate ? "form-item error-border" : 'form-item'} id="product-id" placeholder='Unique ID' value={state.id} onChange={(e) => {
                    setState(prev => ({ ...prev, id: e.target.value }))
                    e.target.value === "" ? setError((prev) => ({ ...prev, id: { errorstate: true, message: "Product ID cannot be empty" } })) : setError((prev) => ({ ...prev, id: { errorstate: false, message: "" } }))
                }} />
                {error.id.errorstate ? <span className='input-error'>{error.id.message}</span> : null}
            </div>
            <div className="form-group">
                <label htmlFor="product-name">Product Name</label>
                <input type="text" className={error.product.errorstate ? "form-item error-border" : 'form-item'} id="product-name" placeholder='Eg. Santoor Soap' value={state.product} onChange={(e) => {
                    setState(prev => ({ ...prev, product: e.target.value }))
                    e.target.value === "" ? setError((prev) => ({ ...prev, product: { errorstate: true, message: "Product name cannot be empty" } })) : setError((prev) => ({ ...prev, product: { errorstate: false, message: "" } }))
                }} />
                {error.product.errorstate ? <span className='input-error'>{error.product.message}</span> : null}
            </div>
            <div className="form-group">
                <label htmlFor="category">Category</label>
                <select className={error.category ? "form-item error-border" : 'form-item'} value={state.categorySelected} onChange={(e) => {
                    setState((prev) => ({ ...prev, categorySelected: parseInt(e.target.value) ? parseInt(e.target.value) : 0 }))
                    e.target.value <= 0 ? setError((prev) => ({ ...prev, category: true })) : setError((prev) => ({ ...prev, category: false }))
                }}>
                    {state.category.map((item, index) => {
                        return <option key={index} value={item.id}>{item.value}</option>
                    })}
                </select>
                {error.category ? <span className='input-error'>Please select a category</span> : null}
            </div>
            <div className="form-price-container">

                <div className="form-group">
                    <label htmlFor="wholesale">WholeSale Price</label>
                    <input type="number" min="1" value={state.wholesale === 0 ? "" : state.wholesale} className={error.wholesale ? "form-item error-border" : 'form-item'} id="wholesale" placeholder='Buy Price' onChange={(e) => {
                        setState(prev => ({ ...prev, wholesale: parseInt(e.target.value) ? parseInt(e.target.value) : 0 }))
                        e.target.value <= 0 ? setError((prev) => ({ ...prev, wholesale: true })) : setError((prev) => ({ ...prev, wholesale: false }))
                    }} />
                    {error.wholesale ? <span className='input-error'>Wholesale price cannot be empty</span> : null}
                </div>
                <div className="form-group">
                    <label htmlFor="price">MRP</label>
                    <input type="number" value={state.price === 0 ? "" : state.price} min="1" className={error.price ? "form-item error-border" : 'form-item'} id="price" placeholder='Sell Price' onChange={(e) => {
                        setState(prev => ({ ...prev, price: parseInt(e.target.value) ? parseInt(e.target.value) : 0 }))
                        e.target.value <= 0 ? setError((prev) => ({ ...prev, price: true })) : setError((prev) => ({ ...prev, price: false }))
                    }} />
                    {error.price ? <span className='input-error'>Price cannot be empty</span> : null}

                </div>
                <div className="form-group">
                    <label htmlFor="stock">Stock</label>
                    <input type="number" min="1" value={state.stock === 0 ? "" : state.stock} className={error.stock ? "form-item error-border" : 'form-item'} id="stock" placeholder='Available Stock' onChange={(e) => {
                        setState(prev => ({ ...prev, stock: parseInt(e.target.value) ? parseInt(e.target.value) : 0 }))
                        e.target.value <= 0 ? setError((prev) => ({ ...prev, stock: true })) : setError((prev) => ({ ...prev, stock: false }))

                    }} />
                    {error.stock ? <span className='input-error'>Stock cannot be empty</span> : null}

                </div>
            </div>


            <div className="form-group">
                <label htmlFor="product-name">Retailer</label>
                <select className={error.retailer ? "form-item error-border" : 'form-item'} value={state.retailerSelected} onChange={(e) => {
                    setState(prev => ({ ...prev, retailerSelected: parseInt(e.target.value) ? parseInt(e.target.value) : 0 }))
                    e.target.value <= 0 ? setError((prev) => ({ ...prev, retailer: true })) : setError((prev) => ({ ...prev, retailer: false }))
                }}>
                    {state.retailer.map((item, index) => {
                        return <option key={index} value={item.id}>{item.value}</option>
                    })}
                </select>
                {error.retailer ? <span className='input-error'>Please select a Wholesaler</span> : null}
            </div>

            <div className="form-group">
                <label htmlFor='p-img'>Product Image</label>
                <input id='p-img' accept="image/*" type='file' onChange={(e) => {
                    const file = e.target.files[0];
                    if (file.size > 10e6) {
                        setSaveLoader({
                            type: "failure",
                            message: "Please upload an image smaller than 10 MB"
                        })
                    } else {
                        setState(prev => ({ ...prev, file: e.target.files[0] }))
                    }
                }} />
            </div>
        </Card >
    )
}

export default AddItem
