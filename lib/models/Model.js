const {GraphQLObjectType,} = require('graphql')

const {i} = require('../helpers');
const {Relation} = require("../relations/Relation");

const {FieldType} = require("./FieldType");
const {PropTypes} = require("./PropTypes");

class Model {

    static _table
    static _uniqueKey
    static fieldNames = {}
    static hidden = []
    static readonly = []
    static queryable = false
    /**
     *
     * @type {typeof Relation[]}
     */
    static relations = []

    /**
     * @type {GraphQLObjectType}
     * @private
     */
    static __graph
    /**
     * @type {Array<FieldType>}
     * @private
     */
    static fields

    /**
     *
     * @return {GraphQLObjectType}
     */
    static graph() {
        if (this.__graph) return this.__graph
        this.__graph = new GraphQLObjectType({
            name: this.className,
            extensions: {
                joinMonster: {
                    sqlTable: this.table,
                    uniqueKey: this.uniqueKey,
                }
            },
            fields: this.__fields.reduce((acc, cur) => ({...acc, [cur.name]: cur.graph()}), {})
        })
        return this.__graph
    }

    /**
     *
     * @param {Map<string, typeof Model>} models
     */
    static buildRelations(models) {
        const fields = this.graph().getFields();
        this.relations.forEach(r => {
                const [key, value] = r.graph();
                fields[key] = value;
            })
    }

    static get uniqueKey() {
        return this._uniqueKey || 'id';
    }

    static get uniqueField() {
        return this.fieldName(this.uniqueKey);
    }

    static get table() {
        if (this._table && this._table.length) return this._table
        return i(this.className, 'plural', 'snake')
    }

    static get className() {
        const instance = new this()
        return instance.constructor.name
    }

    static fieldName(column) {
        return this.fieldNames[column] || column
    }

    static columnName(field) {
        return Object.keys(this.fieldNames)
            .find(key => this.fieldNames[key] === field) || field;
    }
}

module.exports = {
    Model, FieldType, PropTypes
}
