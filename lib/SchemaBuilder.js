const {ConfigModel} = require("./ConfigModel");
const {GraphQLSchema, GraphQLObjectType} = require('graphql')
const {QueryModel} = require('./QueryModel')


class SchemaBuilder {

    /**
     * @type {Array<typeof QueryModel|typeof Model>}
     */
    models

    constructor() {
        this.models = []
    }

    async buildFromConfig(config) {
        const {models} = await ConfigModel.instance(config)
        this.models = models
        return this.build()
    }

    /**
     *
     * @param {Array<typeof QueryModel|typeof Model>} models
     * @return {SchemaBuilder}
     */
    addModels(models) {
        this.models = this.models.concat(models)
        return this
    }

    async build() {
        await Promise.all(this.models.map(m => m.resolveFields()))
        const queryModels = this.models.filter(m => m.prototype instanceof QueryModel)
        this.models.forEach(m => m.injectModels(this.models.reduce((acc, mo) => acc.set(mo.className, mo), new Map())))
        return new GraphQLSchema({
            query: new GraphQLObjectType({
                name: 'Query',
                fields: queryModels.map(m => m.queries()).reduce((acc, cur) => ({...acc, ...cur}), {})
            }),
            mutation: new GraphQLObjectType({
                name: 'Mutation',
                fields: queryModels.map(m => m.mutations()).reduce((acc, cur) => ({...acc, ...cur}), {})
            })
        })
    }
}


module.exports = {SchemaBuilder}
