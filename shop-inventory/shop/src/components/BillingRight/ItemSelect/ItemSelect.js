import React, { useState, useEffect } from 'react';
import api from '../../../api/api';
import $ from 'jquery';
import { BsCartPlus } from 'react-icons/bs'
import './ItemSelect.css'
import Loading from '../../UIElements/Loading/Loading';
import NetworkError from '../../UIElements/NetworkError/NetworkError';
const ItemSelect = (props) => {
    const [state, setState] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [networkError, setNetworkError] = useState(false)


    const getProducts = () => {
        api.get('/fetch/items_in_stock')
            .then(function (response) {
                setState(response.data)
            })
            .catch(function (error) {
                setNetworkError(true)
            }).then(() => {
                setLoading(false)
                $('#products-table').DataTable({
                    initComplete: () => {
                        $('.item-select #products-table').wrap('<div class="dataTables_scroll" />');
                    }
                });

                $('input[type="search"]')[0].placeholder = "Search"
                $('input[type="search"]')[0].previousSibling.textContent = '';
            })
    }

    useEffect(() => {
        setLoading(true)
        getProducts()
    }, [])

    const addItemHandler = (e, index) => {
        var count = 0;
        props.handler((prev) => {
            count += 1
            const found = prev.findIndex(el => el.item_id === state[index].item_id);
            if (found === -1)
                return [
                    ...prev,
                    {
                        item_id: state[index].item_id,
                        item_name: state[index].item_name,
                        stock: state[index].stock,
                        price: state[index].price,
                        quantity: 1,
                        total_price: state[index].price
                    }
                ]
            if (count === 1) {
                if (prev[found].quantity < prev[found].stock) {
                    prev[found].quantity = prev[found].quantity + 1
                    prev[found].total_price = prev[found].quantity * prev[found].price
                    props.totalPriceHandler(previous => previous + prev[found].price)
                    props.totalItemsHandler(previous => previous + 1)
                }
            }
            return prev

        })
        e.currentTarget.classList.add("added")
    }

    return isLoading ? <Loading /> : <div className='item-select'>
        {networkError && <NetworkError />}
        <span className='close' onClick={props.close}>X</span>
        <table className='table-content' id="products-table">
            <thead>
                <tr className='table-heading'>
                    <td>ID</td>
                    <td>Product</td>
                    <td>Category</td>
                    <td>Wholesaler</td>
                    <td>Stock</td>
                    <td>MRP</td>
                    <td>Add</td>
                </tr>
            </thead>
            <tbody>
                {state.map((value, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{value.item_name}</td>
                        <td>{value.category_name}</td>
                        <td>{value.ret_name}</td>
                        <td>{value.stock}</td>
                        <td>{value.price}</td>
                        <td>
                            <button className='add-btn' onClick={(e) => addItemHandler(e, index)}>
                                <BsCartPlus size={15} />
                            </button>
                        </td>
                    </tr>
                )
                )
                }
            </tbody>
        </table>
    </div>;
};

export default ItemSelect;
