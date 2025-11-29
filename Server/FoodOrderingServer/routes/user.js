const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const pool = require('../utils/db')
const result = require('../utils/result')
const config = require('../utils/config')

const router = express.Router()

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    const sql = `SELECT * FROM users WHERE email = ?`
    pool.query(sql, [email], (err, data) => {
        if (err)
            res.send(result.createResult(err))
        else if (data.length == 0)
            res.send(result.createResult("Invalid Email"))
        else {
            // in this else block the data is present i.e 
            // the user is kept at 0th index in the data array
            // check for the pasword
            bcrypt.compare(password, data[0].password, (err, passwordStatus) => {
                if (passwordStatus) {
                    const payload = {
                        uid: data[0].uid,
                    }
                    const token = jwt.sign(payload, config.SECRET)
                    const user = {
                        token,
                        name: data[0].name,
                        email: data[0].email,
                        mobile: data[0].mobile
                    }
                    res.send(result.createResult(null, user))
                }
                else
                    res.send(result.createResult('Invalid Password'))
            })
        }

    })
})

router.post('/signup', (req, res) => {
    const { name, email, password, mobile } = req.body
    const sql = `INSERT INTO users(name,email,password,mobile) VALUES (?,?,?,?)`
    // create the hashedpassword
    bcrypt.hash(password, config.SALT_ROUND, (err, hashedPassword) => {
        if (hashedPassword) {
            pool.query(sql, [name, email, hashedPassword, mobile], (err, data) => {
                res.send(result.createResult(err, data))
            })
        } else
            res.send(result.createResult(err))
    })
})

// give us all the users -> Admin API
router.get('/', (req, res) => {
    const sql = `SELECT * FROM users`
    pool.query(sql, (err, data) => {
        res.send(result.createResult(err, data))
    })
})

router.get('/profile/', (req, res) => {
    const uid = req.headers.uid
    const sql = `SELECT * FROM users WHERE uid = ?`
    pool.query(sql, [uid], (err, data) => {
        if (err)
            res.send(result.createResult(err))
        else {
            const user = {
                name: data[0].name,
                email: data[0].email,
                mobile: data[0].mobile
            }
            res.send(result.createResult(null, user))
        }
    })

})


router.put('/', (req, res) => {
    const { mobile } = req.body
    const uid = req.headers.uid
    const sql = `UPDATE users SET mobile = ? WHERE uid = ?`
    pool.query(sql, [mobile, uid], (err, data) => {
        res.send(result.createResult(err, data))
    })
})

router.delete('/', (req, res) => {
    const uid = req.body.uid
    const sql = `DELETE FROM users WHERE uid = ?`
    pool.query(sql, [uid], (err, data) => {
        res.send(result.createResult(err, data))
    })
})

module.exports = router