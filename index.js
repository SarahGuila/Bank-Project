const exp = require('express')
const session = require('express-session')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const { connectToMongo } = require('./mongo/dbconfig')

const app = exp()

connectToMongo()

const openApiSpecs = swaggerJsdoc({
    definition:{
        openapi:"3.0.0",
        info:{
            description:"Bank API for creating accounts and taking actions like money transfer",
            title:"Open Bank API",
            version:'1.0.0',
        },
        tags:['Accounts', 'Actions','Data'],
    },
    apis:['./routes/*.js'],
})

app.use(exp.json())

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpecs))

app.use(session({
    secret: "BlAhbLaH",
    resave: false,
    saveUninitialized: true,
    name:'nothing-to-see-here'
}))

app.use('/api/account', require('./routes/account'))
app.use('/api/action', require('./routes/action'))
app.use('/api/data', require('./routes/data'))

app.listen(8080, () => console.log("app runing")) 