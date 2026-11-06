import express from 'express'
import pool from '../db.js'
import { resourceLimits } from 'node:worker_threads'

const router = express.Router()

router.get('/', async (req,res) => {
    let sql = "SELECT r.kod, r.nev, r.varos, r.orszag, (SELECT COUNT(*) FROM jaratok WHERE honnan_id = r.id) AS indulo, (SELECT COUNT(*) FROM jaratok WHERE hova_id = r.id) AS erkezo FROM repuloterek r"

    let [rows] = await pool.query(sql)
    return res.json(rows)
})

router.get('/:id', async (req,res) => {
    let repuloter = req.params.id

    let sql = "SELECT * FROM repuloterek WHERE kod = ?"
    let [rows] = await pool.query(sql, [repuloter])

    if (rows.length == 0){
        return res.status(404).send("Nincs ilyen repuloter.")
    }

    return res.json(rows)
})

router.get('/:id/indulasok', async (req,res) => {
    let repuloter = req.params.id

    let sql = "SELECT j.indulas, j.jaratszam, l.nev AS legitarsasag, CONCAT(r2.varos, ' (', r2.kod, ')') AS celallomas, TIME_FORMAT(ADDTIME(j.indulas, SEC_TO_TIME(j.idotartam * 60)), '%H:%i') AS erkezes FROM jaratok j JOIN repuloterek r1 ON j.honnan_id = r1.id JOIN repuloterek r2 ON j.hova_id = r2.id JOIN legitarsasagok l ON j.legitarsasag_id = l.id WHERE r1.kod = ?"

    let [rows] = await pool.query(sql, [repuloter])
    return res.json(rows)
})

export default router