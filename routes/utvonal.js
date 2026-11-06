import express from 'express'
import pool from '../db.js'

const router = express.Router()

router.get('/', async (req, res) => {
    let honnan = req.query.honnan
    let hova = req.query.hova

    if ( !honnan ||!hova ) {
        return res.status(400).send("Hianyzo adatok.")
    }

    if (honnan === hova) {
        return res.status(400).send("A ket pont nem lehet ugyanaz")
    }

    let sql1 = "SELECT kod FROM repuloterek WHERE kod IN (?,?)"
    let [repuloterek] = await pool.query(sql1, [honnan, hova]) 

    if (repuloterek.length !== 2) {
        return res.status(404).send("Nem talalhato ilyen utvonal.")
    }

    let sql2 = "SELECT j.jaratszam, TIME_FORMAT(j.indulas, '%H:%i') AS indulas, TIME_FORMAT(ADDTIME(j.indulas, SEC_TO_TIME(j.idotartam * 60)), '%H:%i') AS erkezes, j.ar FROM jaratok j JOIN repuloterek h ON j.honnan_id = h.id JOIN repuloterek c ON j.hova_id = c.id WHERE h.kod = ? AND c.kod = ? ORDER BY j.ar ASC"
    let [kozvetlenJaratok] = await pool.query(sql2, [honnan, hova])

    // Ez az sql Ai
    let sql3 = `SELECT j1.jaratszam AS elso, j2.jaratszam AS masodik, at.kod AS atszallas,
                TIME_FORMAT(j1.indulas, '%H:%i') AS indulas,
                TIME_FORMAT(ADDTIME(j2.indulas, SEC_TO_TIME(j2.idotartam * 60)), '%H:%i') AS erkezes,
                TIMESTAMPDIFF(MINUTE,ADDTIME(j1.indulas, SEC_TO_TIME(j1.idotartam * 60)),j2.indulas) AS varakozas,
                (j1.ar + j2.ar) AS osszAr
            FROM jaratok j1
            JOIN jaratok j2 ON j2.honnan_id = j1.hova_id
            JOIN repuloterek h ON h.id = j1.honnan_id
            JOIN repuloterek at ON at.id = j1.hova_id
            JOIN repuloterek c ON c.id = j2.hova_id
            WHERE h.kod = ?
              AND c.kod = ?
              AND j1.hova_id <> j2.hova_id
              AND TIMESTAMPDIFF(MINUTE, ADDTIME(j1.indulas, SEC_TO_TIME(j1.idotartam * 60)), j2.indulas) BETWEEN 60 AND 300
            ORDER BY osszAr ASC`
    let [atszallasJaratok] = await pool.query(sql3, [honnan, hova])

    return res.json({
        honnan,
        hova,
        kozvetlenJaratok,
        atszallasJaratok
    })
})

export default router