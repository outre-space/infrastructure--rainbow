const {RouteFlyweight} = require("../flyweights/RouteFlywieight");
const {Provider} = require("./Provider");
const {graphqlHTTP} = require("express-graphql");

class GraphProvider extends Provider {

    static GRAPH_BASE = '/graph'

    static boot() {
        RouteFlyweight.add(
            this.GRAPH_BASE,
            graphqlHTTP({schema: KERNEL_SCHEMA, graphiql: true})
        )
    }
}

module.exports = {GraphProvider}
