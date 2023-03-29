var express = require('express')
var router = express.Router()
const connection = require('./config/database')

//delete customer
router.delete('/delete_customer/:id', (req, res) => {

    connection.query("DELETE FROM `customer` WHERE `customer`.`cust_id` = ?", [req.params.id], (error, results, fields) => {
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


//delete retailer
router.delete('/delete_retailer/:id', (req, res) => {

    connection.query("DELETE FROM `retailer` WHERE `retailer`.`ret_id` = ?", [req.params.id], (error, results, fields) => {
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

//delete items
router.delete('/delete_items/:id', (req, res) => {
    connection.query("DELETE FROM `items` WHERE `items`.`item_id` = ?", [req.params.id], (error, results, fields) => {
        if (error) {
            return res.status(400).send({
                results: "Failed to update Items to items:" + error
            })
        }
        console.log(fields)
        return res.send({
            results
        })
    })
})

//delete category
router.delete('/delete_category/:id', (req, res) => {
    connection.query("DELETE FROM `category` WHERE `category`.`category_id` = ?", [req.params.id], (error, results, fields) => {
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

//delete bills
router.delete('/delete_bills/:id', (req, res) => {
    connection.query("DELETE FROM `sales` WHERE `sales`.`bill_id` = ?", [req.params.id], (error, results, fields) => {
        if (error) {
            return res.status(400).send({
                results: "Failed to update Items to sales:" + error
            })
        }
        return res.send({
            results
        })
    })
})

module.exports = router