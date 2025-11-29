const fs = require('fs')
const express = require('express')
const multer = require('multer')

const result = require('../utils/result')
const pool = require('../utils/db')

const router = express.Router()
const upload = multer({ dest: 'foodimages' })

//route
router.post('/', upload.single('image'), (req, res) => {
    const { name, description, price } = req.body
    // this is thje name to be added in the database
    const image = req.file.filename + '.jpg'

    // rename the added file on the express server to have an extension .jpg
    const oldPath = req.file.path
    const newPath = oldPath + '.jpg'
    fs.rename(oldPath, newPath, (err) => { })

    const sql = `INSERT INTO fooditems(name,description,price,image) VALUES(?,?,?,?)`
    pool.query(sql, [name, description, price, image], (err, data) => {
        res.send(result.createResult(err, data))
    })
})

router.get('/', (req, res) => {
    const sql = `SELECT * FROM fooditems`
    pool.query(sql, (err, data) => {
        res.send(result.createResult(err, data))
    })
})

module.exports = router