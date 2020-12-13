const express = require('express')
const router = express.Router()
const {graphqlHTTP} = require('express-graphql')
const {useSofa, OpenAPI} = require('sofa-api')

const {SchemaBuilder} = require('../lib/SchemaBuilder')

const path = require('path')

const middlewares = async () => {
    const schema = await new SchemaBuilder().buildFromConfig(path.resolve('./config/config.yml'))

    const m1 = graphqlHTTP({schema, graphiql: true})

    const doc = OpenAPI({schema, info: {title: 'Example API',},})
    const m2 = useSofa({schema, onRoute: i => doc.addRoute(i, {basePath: '/api/rest',}),})

    router.use('/graph', m1)
    router.use('/rest', m2)
    router.get('/rest', (req, res) => res.json(doc.get()))
    console.log(doc.get())

    return m2
}


middlewares().then(console.log).catch(console.log)

module.exports = router;