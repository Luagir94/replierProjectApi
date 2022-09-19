const express = require('express')
require('dotenv').config()
const { sequelize } = require("./libs/sequelize/index.js")
const routerClient = require('./routes/clients/index.js')
const routerQuestions = require('./routes/questions/index.js')
const routerUser = require('./routes/users/index.js')

const app = express()



const server = app.listen(process.env.PORT || 8081, () => {
    console.log(`Sv en puerto ${server.address().port}`)
})

app.use(routerUser)
app.use(routerClient)
app.use(routerQuestions)
app.get('/api', (req, res) => {
    res.send(`Bienvenidos`)
})