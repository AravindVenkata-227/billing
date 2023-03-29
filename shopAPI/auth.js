var express = require('express')
var router = express.Router()
const connection = require('./config/database')
const jwt = require('jsonwebtoken')

router.post('/', (req, res) => {
    connection.query("SELECT username from admin where username=? and password=?", [req.body.username, req.body.password], (error, results, fields) => {
        if (error) {
            return res.status(400).send(error)
        }
        console.log(req.body.username)
        if (results.length > 0) {
            var token = jwt.sign({ username: req.body.username }, process.env.PRIVATE_KEY);
            console.log(token)
            return res.send({
                message: "success",
                key: token
            })
        }
        return res.send()
    })

})

router.post('/verify', (req, res) => {
    try {
        var decoded = jwt.verify(req.body.key, process.env.PRIVATE_KEY);
        connection.query("SELECT username from admin where username=?", [decoded.username], (error, results, fields) => {
            if (error) {
                return res.status(400).send()
            }
            if (results.length > 0) {
                return res.send('success')
            }
            return res.status(400).send()
        })
    } catch (err) {
        res.status(400).send();
    }
})

router.put('/change-pw', (req, res) => {
    try {
        connection.query("SELECT username from admin where username=?", [req.body.username], (error, results, fields) => {
            if (error) {
                return res.status(400).send('failed')
            }
            if (results.length > 0) {
                connection.query("UPDATE `admin` SET `password` = '?' WHERE `admin`.`username` = ?;", [req.body.password, req.body.username], (error, results, fields) => {
                    if (error)
                        return res.status(400).send('failed')
                    return res.send('success')
                })


            }
            return res.status(404).send('notfound')
        })
    } catch (err) {
        res.status(400).send();
    }
})

module.exports = router