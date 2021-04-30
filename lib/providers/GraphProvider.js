const {Provider} = require("./Provider");
const {graphqlHTTP} = require("express-graphql");

class GraphProvider extends Provider {

    static GRAPH_BASE = '/graph'

    static boot() {
        return [this.GRAPH_BASE, graphqlHTTP({schema: KERNEL_SCHEMA, graphiql: true}),]
    }
}

module.exports = {GraphProvider}
