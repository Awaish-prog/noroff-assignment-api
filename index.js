// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const {PORT = 4000} = process.env
const cors = require('cors')
if (process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config()
}
const express = require('express')
const app = express()


const HTTP_METHOD_GET = 'get'

server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    next();
});

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


server.listen(PORT, () => {
    console.log('JSON Server is running in port: ' + PORT)
})
