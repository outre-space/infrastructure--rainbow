const {ColumnBuilder} = require("../migrations/ColumnBuilder");
const {BelongsToRelation} = require("../relations/BelongsToRelation");
const {HasOneRelation} = require("../relations/HasOneRelation");
const {HasManyRelation} = require("../relations/HasManyRelation");

const {Model} = require("../models/Model");

class ModelLoader {

    static instantiate(model, resource) {
        return {
            [resource.name]: class extends Model {
                static _table = model.table
                static _uniqueKey = model.primaryKey
                static fieldNames = resource.fieldNames || {}
                static hidden = resource.hidden || []
                static readonly = resource.readonly || []
                static queryable = resource.queryable
                static relations = ModelLoader.loadRelations(model)
                static fields = ColumnBuilder.init()
                    .model(this.config).build(resource.fieldNames)
            }
        }[resource.name];
    }

    /**
     *
     * @param {*} model
     * @return {Relation[]}
     */
    static loadRelations({relations}) {
        if (!relations) return [];
        let result = [];
        const {hasMany, hasOne, belongsTo} = relations;
        if (hasMany) result = result.concat(hasMany.map(name => new HasManyRelation(name)))
        if (hasOne) result = result.concat(hasOne.map(name => new HasOneRelation(name)))
        if (belongsTo) result = result.concat(belongsTo.map(name => new BelongsToRelation(name)))
        return result;
    }

}

module.exports = {ModelLoader};
