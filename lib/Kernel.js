const {ShowQuery} = require("./graph/queries/ShowQuery");
const {IndexQuery} = require("./graph/queries/IndexQuery");
const {GraphQLSchema} = require("graphql");
const {Mutation} = require("./graph/mutations/Mutation");
const {merge} = require("./helpers");
const {GraphQLObjectType} = require("graphql");
const {QueryModel} = require("./models/QueryModel");
const {ModelLoader} = require("./graph/loaders/ModelLoader");
const {ConfigLoader} = require("./graph/loaders/ConfigLoader");

class Kernel {

    /**
     *
     * @returns {Promise<void>}
     */
    static async boot(path) {
        global.KERNEL_CONFIG = await ConfigLoader.load(path)
        KERNEL_CONFIG.models = KERNEL_CONFIG.models && KERNEL_CONFIG.models.length ?
            KERNEL_CONFIG.models.map(model => model.queryable ?
                ModelLoader.loadQueryable(model, KERNEL_CONFIG.queryScheme) :
                ModelLoader.load(model)
            ) : []
        await Promise.all(KERNEL_CONFIG.models.map(m => m.resolveFields()))
        const modelMap = KERNEL_CONFIG.models.reduce((acc, mo) => acc.set(mo.className, mo), new Map())
        KERNEL_CONFIG.models.forEach(m => m.buildRelations(modelMap))
        const qm = KERNEL_CONFIG.models.filter(m => m.prototype instanceof QueryModel)
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
