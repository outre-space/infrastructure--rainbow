const {ModelFlyweight} = require("../flyweights/ModelFlyweight");
const {i} = require("../helpers");
const {GraphQLObjectType, GraphQLField, GraphQLFieldMap} = require("graphql");

class GraphLoader {

    /**
     *
     * @param {typeof Model} model
     * @return {GraphQLObjectType}
     */
    static fromModel(model) {
        return new GraphQLObjectType({
            name: model.className,
            extensions: {
                joinMonster: {
                    sqlTable: model.table,
                    uniqueKey: model.uniqueKey,
                }
            },
            fields: this.fromFields(model.fields)
        })
    }

    /**
     *
     * @param {FieldType[]} fields
     * @return {GraphQLFieldMap}
     */
    static fromFields(fields = []) {
        return fields.reduce((acc, cur) =>
                ({...acc, [cur.name]: this.fromField(cur)}), {});
    }

    /**
     *
     * @param {FieldType} field
     * @return {GraphQLField}
     */
    static fromField(field) {
        return {
            type: field.graphType,
            extensions: {
                joinMonster: {
                    sqlColumn: this.column
                }
            }
        }
    }

    /**
     *
     * @param {Relation[]} relations
     * @param {typeof Model} model
     */
    static fromRelations(relations, model) {
        return relations
            .map(r => this.fromRelation(r, model))
            .reduce((acc, [key, value]) =>
                ({...acc, [key]: value}), model.graph.getFields())
    }

    /**
     *
     * @param {Relation} relation
     * @param {typeof Model} model
     */
    static fromRelation(relation, model) {
        relation.model = model;
        relation.relatedModel = ModelFlyweight.get(relation.related);
        console.log(relation)
        const key = i(relation.related, relation.case, 'camel')
        return [
            key,
            {
                name: key,
                type: relation.type,
                args: [],
                extensions: { joinMonster: relation.join }
            }
        ]
    }
}

module.exports = {GraphLoader}
