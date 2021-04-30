const {QueryModel} = require("../../models/QueryModel");
const {Model} = require("../../models/Model");

class ModelLoader {

    static load(modelConfig) {
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

    static loadQueryable(modelConfig, queryScheme) {
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

module.exports = {ModelLoader};
