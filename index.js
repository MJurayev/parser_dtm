const express = require('express')

const app = express()
const cors = require('cors')
app.use(cors())
require('./startup/db')
require('./startup/routes')

const { parsing } = require('./startup/parser')
 parsing()

 app.get('/', async (req, res)=>{
    try{
        await parsing()
        return res.send('////')
    }
    catch(error){
        console.log(error)
        res.send('errr')
    }
 })
app.listen(9001, ()=>{
    console.log('Parser 9001 da ishlamoqda')
})