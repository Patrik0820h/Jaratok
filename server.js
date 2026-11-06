import express from 'express'
import jaratokRoute from './routes/jaratok.js'
import repuloterRoute from './routes/repuloterek.js'
import legitarsasagRoute from './routes/legitarsasagok.js'
import utvonalRoute from './routes/utvonal.js'

const app = express()
const port = 3000
app.use(express.json())

app.use('/jaratok', jaratokRoute)
app.use('/repuloterek', repuloterRoute)
app.use('/legitarsasagok', legitarsasagRoute)
app.use('/utvonal', utvonalRoute)

app.listen(port, () => {
    console.log("http://localhost:3000")
})