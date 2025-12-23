import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import  cookieParser from 'cookie-parser'

dotenv.config();




const PORT = process.env.PORT || 5000

const app = express()
app.use(cors)
app.use(cookieParser())


app.use(express.json())

const start = () => {
    try {
        app.listen(PORT, () => console.log(`use port - ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}

start()