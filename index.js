// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const {PORT = 4000} = process.env
const cors = require('cors')
const path = require('path')
if (process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config()
}
const express = require('express')
const app = express()



const HTTP_METHOD_GET = 'get'

app.use(express.static(path.join(__dirname, 'build')))
server.use(middlewares)


server.use((request, response, next) => {

    if (request.method.toLowerCase() !== HTTP_METHOD_GET) {

        const token = request.headers['x-api-key'] || ''

        if (!token) {
            return response.status('401').json({error: 'You are not allowed to access this resource'})
        }

        const key = process.env.API_KEY

        if (token === key) {
            return next()
        } else {
            return response.status('401').json({error: 'Invalid API Key provided - are not allowed to access this resource'})
        }
    }
    
    next()
})

server.use(router)

app.get("*", (req, res) => {
    res.sendFile("index.html", {root: path.join(__dirname, "build")})
})

app.listen(5000, () => {
    console.log("running");
})

server.listen(PORT, () => {
    console.log('JSON Server is running in port: ' + PORT)
})
