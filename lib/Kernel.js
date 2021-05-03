const {ShowQuery} = require("./queries/ShowQuery");
const {IndexQuery} = require("./queries/IndexQuery");
const {GraphQLSchema} = require("graphql");
const {Mutation} = require("./mutations/Mutation");
const {merge} = require("./helpers");
const {GraphQLObjectType} = require("graphql");
const {ConfigLoader} = require("./loaders/ConfigLoader");

class Kernel {

    /**
     *
     * @returns {Promise<void>}
     */
    static async boot(path) {
        global.CONFIG_URL = path;
        global.KERNEL_CONFIG = await ConfigLoader.loadConfig(path)
        KERNEL_CONFIG.models.forEach(m => m.buildRelations(KERNEL_MODEL_MAP))
        const qm = KERNEL_CONFIG.models.filter(m => m.queryable)
        global.KERNEL_SCHEMA = new GraphQLSchema({
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
}

module.exports = {Kernel}
