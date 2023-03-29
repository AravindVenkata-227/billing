var express = require('express')
var router = express.Router()
const connection = require('./config/database')

//search by id
router.get('/items/:id', (req, res) => {
    connection.query("SELECT * FROM `items` WHERE item_id=?", [req.params.id], (error, results, fields) => {
        if (error) {
            return res.status(500).send({
                results: "Failed to Fetch info" + error
            })
        }
        if (results.length == 0) {
            return res.status(404).send({
                results: "No such product"
            })
        }
        return res.send({
            results
        })
    })
})

router.get('/items_in_stock/:id', (req, res) => {
    connection.query("SELECT * FROM `items` WHERE product_id=? and stock>0", [req.params.id], (error, results, fields) => {
        if (error) {
            return res.status(500).send({
                results: "Failed to Fetch info" + error
            })
        }
        if (results.length == 0) {
            return res.status(404).send({
                results: "No such product"
            })
        }
        return res.send({
            results
        })
    })
})


router.get('/customer/:id', (req, res) => {
    connection.query("SELECT * FROM `customer` WHERE mobile_no=? or email=?", [req.params.id, req.params.id], (error, results, fields) => {
        if (error) {
            return res.status(500).send({
                results: "Failed to Fetch info" + error
            })
        }
        if (results.length == 0) {
            return res.status(404).send({
                results: "No such customer"
            })
        }
        return res.send(results)
    })
})

router.get('/customer_by_id/:id', (req, res) => {
    connection.query("SELECT * FROM `customer` WHERE cust_id=?", [req.params.id], (error, results, fields) => {
        if (error) {
            console.log(error)
            return res.status(500).send({
                results: "Failed to Fetch info" + error
            })
        }
        if (results.length == 0) {
            return res.status(404).send({
                results: "No such customer"
            })
        }
        return res.send({
            results
        })
    })
})

router.get('/retailer/:id', (req, res) => {
    connection.query("SELECT * FROM `retailer` WHERE ret_id=?", [req.params.id], (error, results, fields) => {
        if (error) {
            return res.status(500).send({
                results: "Failed to Fetch info" + error
            })
        }
        if (results.length == 0) {
            return res.status(404).send({
                results: "No such retailer"
            })
        }
        return res.send({
            results
        })
    })
})

router.get('/category/:id', (req, res) => {
    connection.query("SELECT * FROM `category` WHERE category_id=?", [req.params.id], (error, results, fields) => {
        if (error) {
            return res.status(500).send({
                results: "Failed to Fetch info" + error
            })
        }
        if (results.length == 0) {
            return res.status(404).send({
                results: "No such category"
            })
        }
        return res.send({
            results
        })
    })
})

router.get('/bills/:id', (req, res) => {
    connection.query("SELECT item_name,price,quantity,price*quantity as total FROM `item_has_sale` NATURAL JOIN items WHERE bill_id=?", [req.params.id], (error, results, fields) => {
        if (error) {
            return res.status(500).send({
                results: "Failed to Fetch info" + error
            })
        }
        if (results.length == 0) {
            return res.status(404).send({
                results: "No such category"
            })
        }
        return res.send({
            results
        })
    })
})




// //search by name
// router.get('/by_name/:name', (req, res) => {
//     connection.query("SELECT item_name,stock,price FROM `items` WHERE `item_name` LIKE '%" + req.params.name + "%' order by item_name ASC", (error, results, fields) => {
//         if (error) {
//             return res.status(500).send({
//                 results: "Failed to Fetch info" + error
//             })
//         }
//         if (results.length == 0) {
//             return res.status(404).send({
//                 results: "No such item"
//             })
//         }
//         return res.send({
//             results
//         })
//     })
// })

module.exports = router