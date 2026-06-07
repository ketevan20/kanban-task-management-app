const express = require('express')
const connectToDB = require('./config/connectToDB')

const app = express()
app.use(express.json())

connectToDB()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(3001, () => {
    console.log("server is running on port 3001")
})