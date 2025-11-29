const mysql2 = require('mysql2')

const pool = mysql2.createPool({
    host: 'localhost',
    user: 'W1_92626_Abhishek_Pagar',
    password: 'manager',
    database: 'onlinefoodordering_db'
})

module.exports = pool