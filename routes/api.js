const express = require('express')
const router = express.Router()
const {graphqlHTTP} = require('express-graphql')
const {useSofa, OpenAPI} = require('sofa-api')

const {SchemaBuilder} = require('../lib/SchemaBuilder')

const path = require('path')

const middlewares = async () => {
    const schema = await new SchemaBuilder().buildFromConfig(process.env.CONFIG_URL)

    const doc = OpenAPI({schema, info: {title: 'Outre Rainbow APIs',},})

    router.use('/graph', graphqlHTTP({schema, graphiql: true}))
    router.get('/rest', (req, res) =>
        res.json(doc.get()))
    router.use('/rest', useSofa({schema, onRoute: i => doc.addRoute(i, {basePath: '/api/rest',}),}))

}


middlewares().catch(console.log)

module.exports = router;
