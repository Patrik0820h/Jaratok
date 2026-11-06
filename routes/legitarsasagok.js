import express from 'express'
import pool from '../db.js'

const router = express.Router()

router.get('/', async (req,res) => {
    let sql = "SELECT l.kod, l.nev, COUNT(DISTINCT j.id) AS jaratDB, COUNT(DISTINCT j.hova_id) AS celallomasDB, MIN(j.ar) AS legolcsobb, ROUND(AVG(j.ar)) AS atlagAr FROM legitarsasagok l LEFT JOIN jaratok j ON l.id = j.legitarsasag_id GROUP BY l.id, l.kod, l.nev ORDER BY jaratDB DESC, l.nev ASC"

    let [rows] = await pool.query(sql)
    return res.json(rows)
}) 

export default router