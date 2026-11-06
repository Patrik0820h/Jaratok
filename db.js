import mysql from 'mysql2/promise'

const dbconfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jaratok',
    port: '3307'
}

const pool = mysql.createPool(dbconfig)

export default pool