const express = require('express')

const pool = require('../utils/db')
const result = require('../utils/result')

const router = express.Router()

router.post('/', (req, res) => {
    const uid = req.headers.uid
    const { total_amount, foodItems } = req.body
    const sql1 = `INSERT INTO orders(uid,total_amount) values(?,?)`
    const sql2 = `INSERT INTO orderdetails(oid,fid,quantity) VALUES(?,?,?)`
    pool.query(sql1, [uid, total_amount], (error, data) => {
        if (data) {
            const oid = data.insertId
            for (const f of foodItems)
                pool.query(sql2, [oid, f.fid, f.quantity], (error, data) => { })
        }
        res.send(result.createResult(error, data))
    })
})

router.get('/', (req, res) => {
    const uid = req.headers.uid
    const sql = `SELECT oid, cast(Date(odate) as char) odate,total_amount,status FROM orders WHERE uid = ?`
    // const sql =
    //     `SELECT o.oid,o.total_amount,o.deldate,o.status,d.fid,d.quantity,f.name FROM orders o 
    //     INNER JOIN orderdetails d ON o.oid = d.oid
    //     INNER JOIN fooditems f ON d.fid = f.fid 
    //     WHERE uid = ?`
    pool.query(sql, [uid], (error, data) => {
        res.send(result.createResult(error, data))
    })
})

router.put('/', (req, res) => {
    const { oid, status } = req.body
    const sql = `UPDATE orders SET status = ? WHERE oid = ?`
    pool.query(sql, [status, oid], (error, data) => {
        res.send(result.createResult(error, data))
    })
})

module.exports = router