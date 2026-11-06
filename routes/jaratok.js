import express from 'express'
import pool from '../db.js'

const router = express.Router()

router.get('/', async (req,res) => {
    let honnan = req.query.honnan
    let hova = req.query.hova
    let legitarsasag = req.query.legitarsasag

    if (honnan && hova){
        if (hova.length !== 3 || honnan.length !== 3){
            return res.status(400).send("Nem megfelelo adat.")
        }
        let sql = "SELECT j.jaratszam FROM jaratok j LEFT JOIN repuloterek r1 ON j.honnan_id = r1.id LEFT JOIN repuloterek r2 ON j.hova_id = r2.id WHERE r1.kod = UPPER(?) AND r2.kod = UPPER(?)"
        
        let [rows] = await pool.query(sql, [honnan, hova])

        if (rows.length == 0){
            return res.status(404).send("Nem talalhato ilyen jarat.")
        }

        return res.json(rows)
    }

    if (legitarsasag) {
        let sql = "SELECT j.* FROM jaratok j LEFT JOIN legitarsasagok l ON j.legitarsasag_id = l.id WHERE l.kod = ?"

        let [rows] = await pool.query(sql, [legitarsasag])
        return res.json(rows)
    }

    let sql = "SELECT * FROM jaratok ORDER BY indulas"

    let [rows] = await pool.query(sql)
    return res.json(rows)
})

router.get('/:id', async (req,res) => {
    let jaratszam = req.params.id

    let sql = "SELECT * FROM jaratok WHERE jaratszam = ?"

    let [rows] = await pool.query(sql, [jaratszam])
    if (rows.length == 0){
        return res.status(400).send("Nem talalhato ilyen jarat.")
    }
    return res.json(rows)
})

export default router