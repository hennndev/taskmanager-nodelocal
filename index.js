const express = require('express')
const appRoute = require('./routes/appRoute')
const app = express()



app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(appRoute)


app.listen(5000, () => console.log('Server has been connected in port 5000'))