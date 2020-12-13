const {ConfigLoader} = require("./ConfigLoader");
const {QueryModel} = require("./QueryModel");
const {Model} = require("./Model");

class ConfigModel {

    static async instance(path) {
        let config = await ConfigLoader.load(path)
        config.models = config.models && config.models.length ?
            config.models.map(queryModel => queryModel.queryable ? this.queryModel(queryModel, config.queryScheme) : this.model(queryModel))
            : []
        return config
    }

    static model(modelConfig) {
        return {
            [modelConfig.name]: class extends Model {
                static _table = modelConfig.table
                static _uniqueKey = modelConfig.uniqueKey
                static fieldNames = modelConfig.fieldNames || {}
                static hidden = modelConfig.hidden || []
                static hasMany = modelConfig.hasMany || []
                static hasOne = modelConfig.hasOne || []
                static belongsTo = modelConfig.belongsTo || []
            }
        }[modelConfig.name];
    }

    static queryModel(modelConfig, queryScheme) {
        return {
            [modelConfig.name]: class extends QueryModel {
                static _table = modelConfig.table
                static _uniqueKey = modelConfig.uniqueKey
                static fieldNames = modelConfig.fieldNames || {}
                static hidden = modelConfig.hidden || []
                static hasMany = modelConfig.hasMany || []
                static hasOne = modelConfig.hasOne || []
                static belongsTo = modelConfig.belongsTo || []
                static readonly = modelConfig.readonly || []
                static queryScheme = queryScheme
            }
        }[modelConfig.name];
    }
}

module.exports = {ConfigModel}

