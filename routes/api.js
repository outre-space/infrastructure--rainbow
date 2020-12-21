const express = require('express')
const router = express.Router()
const {graphqlHTTP} = require('express-graphql')
const {useSofa, OpenAPI} = require('sofa-api')
const {writeFileSync} = require('fs')
const path = require('path')

const {SchemaBuilder} = require('../lib/SchemaBuilder')

const GRAPH_BASE = '/graph'
const REST_BASE = '/rest'

const middlewares = async () => {
    const schema = await new SchemaBuilder().buildFromConfig(process.env.CONFIG_URL)

    const doc = OpenAPI({schema, info: {title: 'Outre Rainbow APIs',},})

    doc.save(path.resolve('public', 'swagger.json'))

    router.use(GRAPH_BASE, graphqlHTTP({schema, graphiql: true}))
    router.get(REST_BASE, (req, res) =>
        res.json(doc.get()))
    router.use(REST_BASE, useSofa({schema, onRoute: i => doc.addRoute(i, {basePath: REST_BASE,}),}))

}


middlewares().catch(console.log)

module.exports = router;
