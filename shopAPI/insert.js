var express = require('express')
var router = express.Router()
const connection = require('./config/database')
const upload = require('./multer')

//insert customer
router.post('/create_customer', (req, res) => {
    connection.query("INSERT INTO `customer` (`cust_name`, `address`, `mobile_no`, `email`) VALUES (?,?,?,?);", [req.body.name, req.body.address, req.body.phone, req.body.email], (error, result, field) => {
        if (error) {
            return res.status(400).send(error)
        }
        return res.send({
            results: result
        })
    })
})

//insert retailer
router.post('/create_retailer', (req, res) => {
    connection.query("INSERT INTO `retailer` (`ret_name`, `address`, `mobile_no`, `email`) VALUES (?,?,?,?);", [req.body.name, req.body.address, req.body.phone, req.body.email], (err, result, field) => {
        if (err) {
            return res.status(400).send(err)
        }
        return res.send({
            results: result
        })
    })
})


//insert items
router.post('/add_item', upload.single('product'), (req, res) => {
    const file = req.file;
    var filename = file ? file.filename : '';
    connection.query("INSERT INTO `items` (`product_id`,`item_name`, `stock`, `wholesale`, `price`, `cat_id`, `ret_id`,`image`) VALUES (?,?,?,?,?,?,?,?);", [req.body.product_id, req.body.item_name, req.body.stock, req.body.wholesale, req.body.price, req.body.category_id, req.body.retailer_id, filename], (error, results, fields) => {
        if (error) {
            return res.status(400).send(error)
        }
        return res.send({
            results
        })
    })
})

//insert category
router.post('/add_category', (req, res) => {
    connection.query("INSERT INTO `category` (`category_name`) VALUES (?);", [req.body.category_name], (error, results, fields) => {
        if (error) {
            return res.status(400).send(error)
        }
        return res.send({
            results
        })
    })

})

//insert bill
router.post('/add_bill', async (req, res) => {
    var bill_id
    const body = req.body
    var price = 0
    const promise = new Promise((resolve, reject) => {
        body.items.map((item, index) => {
            connection.query('select price from items where item_id=?', [item[0]], (error, results, fields) => {
                if (error) {
                    return res.status(400).send({
                        results: "Failed to fetch price:" + error
                    })
                }
                item.splice(2, 0, item[1] * results[0].price)
                price += item[2]
                if (index === body.items.length - 1) {
                    resolve()
                }
            })
        })
    })

    promise.then(() => {

        const cust_id = body.cust_id
        connection.query("INSERT INTO `sales` (`price`,`cust_id`) VALUES (?,?);", [price, cust_id], async (error, results, fields) => {
            if (error) {
                return res.status(400).send({
                    results: "Failed to add Items to sales:" + error
                })
            }
            bill_id = results.insertId;
            body.items.map(item => {
                item.splice(1, 0, bill_id)
            })
            connection.query("INSERT INTO `item_has_sale` (`item_id`,`bill_id`,`quantity`,`total_price`) VALUES ?;", [body.items], (errr, result, field) => {
                if (errr) {

                    return connection.query("DELETE FROM `sales` WHERE `sales`.`bill_id` = ?", [bill_id], (err, result, field) => {
                        if (errr.code === 'ER_DATA_OUT_OF_RANGE') {
                            res.status(406).send({
                                results: "Quantity is greater than stock"
                            })
                        } else {
                            res.status(400).send({
                                results: "Failed to add Items to sales" + err
                            })
                        }

                    })
                }
                return res.send({
                    results: result
                })
            })
        })

    }).catch((error) => {
        console.log(error)
    })

})

module.exports = router