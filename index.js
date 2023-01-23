// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const {PORT = 3000} = process.env
const cors = require('cors')
if (process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config()
}

const cors = jsonServer.defaults({ noCors: true })

const HTTP_METHOD_GET = 'get'

server.use(middlewares)
server.use(cors)
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
