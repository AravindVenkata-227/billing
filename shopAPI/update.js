var express = require('express')
var router = express.Router()
const connection = require('./config/database')
const upload = require('./multer')
//update customer
router.put('/update_customer/:id', (req, res) => {

    connection.query("UPDATE `customer` SET `cust_name` = ?, `address` = ?, `mobile_no` = ?, `email` = ? WHERE `customer`.`cust_id` = ?;", [req.body.customer_name, req.body.address, req.body.mobile_no, req.body.email, req.params.id], (error, results, fields) => {
        if (error) {
            return res.status(400).send({
                results: "Failed to update Items to customer:" + error
            })
        }
        return res.send({
            results
        })
    })
})

//update retailer
router.put('/update_retailer/:id', (req, res) => {

    connection.query("UPDATE `retailer` SET `ret_name` = ?, `address` = ?, `mobile_no` = ?, `email` = ? WHERE `retailer`.`ret_id` = ?;", [req.body.retailer_name, req.body.address, req.body.mobile_no, req.body.email, req.params.id], (error, results, fields) => {
        if (error) {
            return res.status(400).send({
                results: "Failed to update Items to retailer:" + error
            })
        }
        return res.send({
            results
        })
    })
})

//update items
router.put('/update_items/:id', upload.single('product'), (req, res) => {
    const file = req.file;
    var filename = file ? file.filename : req.body.product;
    connection.query("UPDATE `items` SET `product_id`=?, `item_name` = ?, `stock` = ?, `wholesale` = ?, `price` = ?, `cat_id` = ?, `ret_id` = ?, `image`= ? WHERE `items`.`item_id` = ?;", [req.body.product_id, req.body.item_name, req.body.stock, req.body.wholesale, req.body.price, req.body.category_id, req.body.retailer_id, filename, req.params.id], (error, results, fields) => {
        if (error) {
            return res.status(400).send(error)
        }
        return res.send({
            results
        })
    })
})


//update category
router.put('/update_category/:id', (req, res) => {

    connection.query("UPDATE `category` SET `category_name` = ? WHERE category_id = ?;", [req.body.category_name, req.params.id], (error, results, fields) => {
        if (error) {
            return res.status(400).send({
                results: "Failed to update Items to category:" + error
            })
        }
        return res.send({
            results
        })
    })
})

module.exports = router