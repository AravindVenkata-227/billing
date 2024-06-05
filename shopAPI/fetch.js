var express = require('express')
var router = express.Router()
const connection = require('./config/database')
const cors = require('cors')

router.use(cors())
//fetch total statistics
router.get('/info', (req, res) => {
    const result = {}
    connection.query('SELECT count(*) AS count FROM `customer`', (error, results, fields) => {
        if (error) {
            return res.status(500).send({
                results: "Failed to Fetch info"
            })
        }
        result.customer = results[0].count
        connection.query('SELECT count(*) AS count FROM `retailer`', (error, results, fields) => {
            if (error) {
                return res.status(500).send({
                    results: "Failed to Fetch info"
                })
            }
            result.retailer = results[0].count
            connection.query('SELECT count(*) AS count FROM `items`', (error, results, fields) => {
                if (error) {
                    return res.status(500).send({
                        results: "Failed to Fetch info"
                    })
                }
                result.items = results[0].count
                connection.query('SELECT sum(price) AS revenue FROM `sales`', (error, results, fields) => {
                    if (error) {
                        return res.status(500).send({
                            results: "Failed to Fetch info"
                        })
                    }
                    result.revenue = results[0].revenue
                    res.send(result)
                })
            })
        })
    })
})

//fetch today's statistics
router.get('/info_today', (req, res) => {
    const result = {}
    connection.query("SELECT count(*) as count FROM sales WHERE s_date = CURRENT_DATE;", (error, results, fields) => {
        if (error) {
            return res.status(500).send({
                results: "Failed to Fetch info"
            })
        }
        result.sales_today = results[0].count
        connection.query("SELECT sum(quantity) as total_items FROM item_has_sale,sales WHERE item_has_sale.bill_id = sales.bill_id and s_date = CURRENT_DATE;", (error, results, fields) => {
            if (error) {
                return res.status(500).send({
                    results: "Failed to Fetch info"
                })
            }
            result.items_today = results[0].total_items === null ? 0 : results[0].total_items
            connection.query("SELECT sum(price) as sum FROM `sales` WHERE s_date = CURRENT_DATE; ", (error, results, fields) => {
                if (error) {
                    return res.status(500).send({
                        results: "Failed to Fetch info"
                    })
                }
                result.revenue_today = results[0].sum === null ? 0 : results[0].sum
                connection.query('SELECT COUNT(*) AS count FROM `items` WHERE stock=0;', (error, results, fields) => {
                    if (error) {
                        return res.status(500).send({
                            results: "Failed to Fetch info"
                        })
                    }
                    result.out_of_stock = results[0].count
                    connection.query("SELECT COUNT(*) AS count FROM `items` WHERE stock<=5", (error, results, fields) => {
                        if (error) {
                            return res.status(500).send({
                                results: "Failed to Fetch info"
                            })
                        }
                        result.low_stock = results[0].count
                        connection.query("select COUNT(DISTINCT cust_id) as count from `sales` WHERE s_date=CURRENT_DATE;", (error, results, fields) => {
                            if (error) {
                                return res.status(500).send({
                                    results: "Failed to Fetch info"
                                })
                            }
                            result.customer_count = results[0].count
                            res.send(result)
                        })
                    })
                })
            })
        })

    })
})


// fetch best selling items
router.get('/best_sellers', (req, res) => {
    connection.query("SELECT DISTINCT `item_name`,`price`,`stock`,(SELECT SUM(quantity) from item_has_sale WHERE item_id=S.item_id )*price as total_revenue FROM item_has_sale S NATURAL JOIN items I order by `quantity` desc LIMIT 5;", (error, results, fields) => {
        if (error) {
            return res.status(500).send({
                results: "Failed to Fetch best_sellers"
            })
        }
        res.send(results)
    })
})

// fetch all items
router.get('/items_in_stock', (req, res) => {
    connection.query("select item_id,item_name,category_name,ret_name,stock,wholesale,price from items I,retailer R,category C where I.ret_id = R.ret_id and I.cat_id = C.category_id and stock>0 ORDER BY item_name ASC", (error, results, fields) => {
        if (error) {
            return res.status(500).send({
                results: "Failed to Fetch info" + error
            })
        }
        res.send(results)
    })
})

router.get('/items', (req, res) => {
    connection.query("select DISTINCT item_id,item_name,category_name,ret_name,stock,wholesale,price,image from items I,retailer R,category C where I.ret_id = R.ret_id and I.cat_id = C.category_id ORDER BY item_name ASC", (error, results, fields) => {
        if (error) {
            return res.status(500).send({
                results: "Failed to Fetch info" + error
            })
        }
        res.send(results)
    })
})

// fetch all customers
router.get('/customers', (req, res) => {
    connection.query("SELECT * FROM customer ORDER BY `cust_name` ASC;", (error, results, fields) => {
        if (error) {
            return res.status(500).send({
                results: "Failed to Fetch info"
            })
        }
        res.send(results)
    })
})

//fetch all retailers
router.get('/retailers', (req, res) => {
    connection.query("SELECT * FROM retailer ORDER BY `ret_name` ASC;", (error, results, fields) => {
        if (error) {
            return res.status(500).send({
                results: "Failed to Fetch info"
            })
        }
        res.send(results)
    })
})

//fetch all bills generated
router.get('/bills', (req, res) => {
    connection.query("SELECT bill_id,cust_name,s_date AS bill_date,mobile_no,price,(SELECT SUM(quantity) FROM item_has_sale WHERE bill_id=S.bill_id) AS total_items FROM sales S NATURAL JOIN customer C ORDER BY bill_id DESC;", (error, results, fields) => {
        if (error) {
            return res.status(500).send({
                results: "Failed to Fetch info"
            })
        }
        res.send(results)
    })
})

//fetch all out of stock items
router.get('/out_of_stock', (req, res) => {
    connection.query("SELECT item_id,item_name,ret_name,mobile_no,email,wholesale from items I,retailer R where I.ret_id = R.ret_id and stock<=5;", (error, results, fields) => {
        if (error) {
            return res.status(500).send({
                results: "Failed to Fetch info"
            })
        }
        res.send(results)
    })
})

router.get('/categories', (req, res) => {
    connection.query("select category_id as id, category_name as value from category;", (error, results, fields) => {
        if (error) {
            return res.status(500).send({
                results: "Failed to Fetch info"
            })
        }
        res.send(results)
    })
})

router.get('/retailers_select', (req, res) => {
    connection.query("SELECT ret_id as id,ret_name as value FROM retailer", (error, results, fields) => {
        if (error) {
            return res.status(500).send({
                results: "Failed to Fetch info"
            })
        }
        res.send(results)
    })
})

module.exports = router