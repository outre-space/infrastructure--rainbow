const {useSofa, OpenAPI} = require('sofa-api')
const path = require('path')
const {ShowQuery} = require("../queries/ShowQuery");
const {IndexQuery} = require("../queries/IndexQuery");
const {Mutation} = require("../mutations/Mutation");
const {merge} = require("../helpers");
const {GraphQLObjectType} = require("graphql");
const {GraphQLSchema} = require("graphql");
const {ModelFlyweight} = require("../flyweights/ModelFlyweight");
const {graphqlHTTP} = require("express-graphql");

const {Provider} = require("./Provider");
const {RouteFlyweight} = require("../flyweights/RouteFlywieight");

class HttpProvider extends Provider {

    static REST_BASE = '/rest'
    static GRAPH_BASE = '/graph'

    static boot() {
        const schema = this.schema();
        const doc = this.buildDoc(schema);
        RouteFlyweight.add(this.REST_BASE, useSofa({
                schema,
                onRoute: i => {
                    doc.addRoute(i, {basePath: this.REST_BASE,});
                    doc.save(path.resolve('public', 'swagger.json'))
                },
            })
        );
        RouteFlyweight.add(this.GRAPH_BASE, graphqlHTTP(
            {schema, graphiql: true})
        );
    }

    static schema() {
        const qm = ModelFlyweight.all.filter(m => m.queryable)
        return new GraphQLSchema({
            query: new GraphQLObjectType({
                name: 'Query',
                fields: merge(qm.map(m => ({...IndexQuery.create(m), ...ShowQuery.create(m)})))
            }),
            mutation: new GraphQLObjectType({
                name: 'Mutation',
                fields: merge(qm.map(Mutation.create))
            })
        })
    }

    static buildDoc(schema) {
        return OpenAPI({
            schema: schema,
            info: {
                title: 'Outre Rainbow APIs', contact: {
                    name: "Outre Support",
                    url: "http://www.outrespace.com/support",
                    email: "support@outrespace.com"
                },
                license: {
                    name: "Apache 2.0",
                    url: "https://www.apache.org/licenses/LICENSE-2.0.html"
                },
                version: "1.0.1"
            },
            servers: [
                {url: './'}
            ]
        })
    }
}

module.exports = {HttpProvider}
