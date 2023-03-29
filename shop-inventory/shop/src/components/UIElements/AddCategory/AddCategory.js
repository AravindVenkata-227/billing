import React, { useEffect, useState } from 'react'
import api from '../../../api/api'
import Card from '../Card/Card'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBinLine } from 'react-icons/ri'
import './AddCategory.css'
import Modal from '../Modal/Modal'
import Confirm from '../Confirm/Confirm'
const AddCategory = (props) => {
    const [state, setState] = useState({
        category_name: "",
    })

    const [categories, setCategories] = useState([])
    const [reload, setReload] = useState(0)
    const [error, setError] = useState({
        category_name: { errorstate: false, message: "" },
    })

    const [deleteParams, setDeleteParams] = useState({})
    const [deleteModal, setDeleteModal] = useState(false)

    const [saveLoader, setSaveLoader] = useState(false)

    const [modifyParams, setModifyParams] = useState({})
    const getCategories = () => {
        api.get(`/fetch/categories`)
            .then(function (response) {
                if (reload === 0)
                    setSaveLoader(false)
                setCategories(response.data)
            })
            .catch(function (error) {
                setSaveLoader({
                    type: "failure",
                    message: "Something went wrong! Please reload"
                })
                console.log(error);
            })
    }

    useEffect(() => {
        getCategories()
        if (reload === 0)
            setSaveLoader({
                type: "loading-state",
                message: "Please wait..."
            })
    }, [reload])


    const forceReload = () => {
        setReload(prev => prev + 1)
    }
    const handleModify = (id, category_name) => {
        setModifyParams({
            id,
            category_name
        })
        setState(prev => ({
            ...prev,
            category_name
        }))
    }

    const closeModal = () => {
        setDeleteModal(false)
    }
    const deleteFromDB = () => {
        setDeleteModal(false)
        setSaveLoader({
            type: "loading-state",
            message: "Please wait..."
        })
        api.delete(`/delete/delete_category/${deleteParams.id}`)
            .then(() => {
                setSaveLoader({
                    type: "data-success",
                    message: deleteParams.category_name + "  deleted successfully"
                })
                forceReload()
            })
            .catch((error) => {
                setSaveLoader({
                    type: "failure",
                    message: "Something went wrong! Please reload"
                })
            })
    }

    const handleDelete = (id, category_name) => {
        setDeleteParams({
            id,
            category_name
        })
        setDeleteModal(true)
    }

    const addCategory = () => {
        setSaveLoader({
            type: "loading-state",
            message: "Please wait!!"
        })
        if (state.category_name.length > 0) {
            setError(
                {
                    category_name: { errorstate: false, message: "" },
                }
            )
            if (modifyParams.id) {
                api.put(`/update/update_category/${modifyParams.id}`, {
                    "category_name": state.category_name,
                }).then(() => {
                    setModifyParams({});
                    setState({
                        category_name: "",
                    })
                    setSaveLoader({
                        type: "data-success",
                        message: state.category_name + "  updated successfully"
                    })
                    forceReload()
                }).catch((error) => {
                    setSaveLoader(false)
                    if (error.response.data.code !== 'ER_DUP_ENTRY') {
                        setSaveLoader({
                            type: 'failure',
                            message: 'Failed to update ' + state.category_name
                        })
                    } else {
                        if (error.response.data.sqlMessage === "Duplicate entry '" + state.category_name + "' for key 'category_name'")
                            setError(prev => ({ ...prev, category_name: { errorstate: true, message: "Category already Exists" } }))
                    }
                })
            } else {
                api.post('create/add_category', {
                    "category_name": state.category_name,
                }).then(() => {
                    setSaveLoader({
                        type: "data-success",
                        message: state.category_name + " created successfully"
                    })
                    setState({
                        category_name: "",
                    })
                    forceReload()
                }).catch((error) => {
                    setSaveLoader(false)
                    setError(prev => ({ ...prev, category_name: { errorstate: true, message: "Category already Exists" } }))
                })
            }
        } else {
            setSaveLoader(false)
            state.category_name === "" ? setError((prev) => ({ ...prev, category_name: { errorstate: true, message: "Category name cannot be empty" } })) : setError((prev) => ({ ...prev, category_name: { errorstate: false, message: "" } }))
        }
    }

    const closeHandler = () => {
        if (saveLoader && saveLoader.type === 'data-success' && props.reloadHandler)
            props.reloadHandler();

        props.closeHandler();
    }

    return (<>
        {deleteModal && <Modal><Confirm content={deleteParams.category_name} delete={deleteFromDB} closeModal={closeModal} /></Modal>}
        <Card heading="Add Category" close={closeHandler} submitHandler={addCategory}>
            {saveLoader && <div className={'current-state ' + saveLoader.type}>{saveLoader.message}</div>}
            <div className="form-group">
                <label htmlFor="category-name">Category Name</label>
                <input type="text" className={error.category_name.errorstate ? "form-item error-border" : 'form-item'} id="category-name" placeholder='Eg. Food' value={state.category_name} onChange={(e) => {
                    setState(prev => ({ ...prev, category_name: e.target.value }))
                    e.target.value === "" ? setError((prev) => ({ ...prev, category_name: { errorstate: true, message: "Category name cannot be empty" } })) : setError((prev) => ({ ...prev, category_name: { errorstate: false, message: "" } }))
                }} />
                {error.category_name.errorstate && <span className='input-error'>{error.category_name.message}</span>}
            </div>
            <div className='category-table-container'>

                <table className='category-table'>
                    <thead>
                        <tr>
                            <td>Category</td>
                            <td>Modify</td>
                        </tr>
                    </thead>
                    <tbody key={reload}>
                        {categories.map((value, index) => {
                            return (
                                <tr key={index}>
                                    <td>{value.value}</td>
                                    <td>
                                        <button className='modify-btn' onClick={() => handleModify(value.id, value.value)} >
                                            <FiEdit color="#4C6FE6" size={20} />
                                        </button>
                                        <button className='modify-btn' onClick={() => handleDelete(value.id, value.value)}>

                                            <RiDeleteBinLine color="#ED374E" size={20} />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
            </div>
        </Card >
    </>
    )
}

export default AddCategory
