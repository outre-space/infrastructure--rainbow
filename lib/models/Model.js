const {
    GraphQLObjectType,
    GraphQLBoolean,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList
} = require('graphql')

const {i} = require('../helpers');
const db = require('../database')

class PropTypes {
    static int = 'integer'
    static string = 'string'
    static text = 'text'
    static boolean = 'boolean'
    static float = 'float'
    static double = 'double'
}

class FieldType {

    column;
    _name;
    nullable;
    type;

    constructor(column, {type, nullable, name}) {
        this.column = column;
        this._name = name;
        this.nullable = nullable;
        this.type = type;
    }

    graph() {
        return {
            type: this.graphType,
            extensions: {
                joinMonster: {
                    sqlColumn: this.column
                }
            }
        }
    }

    get name() {
        return this._name || this.column
    }

    get graphType() {
        switch (this.type) {
            case PropTypes.int:
                return GraphQLInt
            case PropTypes.boolean:
                return GraphQLBoolean
            case PropTypes.float:
            case PropTypes.double:
                return GraphQLFloat
            case PropTypes.string:
            case PropTypes.text:
            default:
                return GraphQLString
        }
    }
}

class Model {

    static _table
    static _uniqueKey
    static fieldNames = {}
    static hidden = []
    static hasMany = []
    static hasOne = []
    static belongsTo = []
    /**
     * @type {GraphQLObjectType}
     * @private
     */
    static __graph
    /**
     * @type {Array<FieldType>}
     * @private
     */
    static __fields

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
            fields: this.__fields.reduce((acc, cur) => Object.defineProperty(acc, cur.name, {value: cur.graph(), enumerable: true}), {})
        })
        return this.__graph
    }

    /**
     *
     * @param {Map<string, typeof Model>} models
     */
    static buildRelations(models) {
        this.hasOneGraph(models)
        this.hasManyGraph(models)
        this.belongsToGraph(models)
    }

    static async tableFields() {
        try {
            const ci = await db.describeTable(this.table)
            return Object.keys(ci)
                .filter(column => !this.hidden.includes(column))
                .map(column => {
                    const {type, nullable} = ci[column]
                    const name = this.fieldNames[column]
                    return new FieldType(column, {type, nullable, name});
                });
        } catch (e) {
            console.log(e)
        }
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

    static get fields() {
        return this.__fields;
    }

    static columnName(field) {
        return Object.keys(this.fieldNames)
            .find(key => this.fieldNames[key] === field) || field;
    }

    static async resolveFields() {
        this.__fields = await this.tableFields()
    }

    /**
     *
     * @param {Map<string, typeof Model>} models
     */
    static hasManyGraph(models) {
        const uniqueKey = this.uniqueKey, table = this.table
        const fields = this.graph().getFields()
        this.hasMany.filter(m => models.has(m)).forEach(m => {
            const modelClass = models.get(m), key = i(m, 'plural', 'camel')
            fields[key] = {
                name: key,
                type: new GraphQLList(modelClass.graph()),
                args: [],
                extensions: {
                    joinMonster: {
                        // sqlJoin: (parent, child, args) => `${parent}.${uniqueKey} = ${child}.${i.singularize(parent)}_${uniqueKey}`
                        sqlBatch: {
                            thisKey: `${i(table, 'singular')}_${uniqueKey}`,
                            parentKey: uniqueKey
                        },
                    }
                }
            }
        })
    }

    /**
     *
     * @param {Map<string, typeof Model>} models
     */
    static hasOneGraph(models) {
        const uniqueKey = this.uniqueKey, table = this.table
        const fields = this.graph().getFields()
        this.hasOne.filter(m => models.has(m)).forEach(m => {
            const modelClass = models.get(m), key = i(m, 'singular', 'camel')
            fields[key] = {
                name: key,
                type: modelClass.graph(),
                args: [],
                extensions: {
                    joinMonster: {
                        // sqlJoin: (parent, child, args) => `${parent}.${uniqueKey} = ${child}.${i.singularize(child)}_${modelClass.uniqueKey}`,
                        sqlBatch: {
                            thisKey: `${i(table, 'singular')}_${uniqueKey}`,
                            parentKey: uniqueKey
                        },
                    }
                }
            }
        })
    }

    /**
     *
     * @param {Map<string, typeof Model>} models
     */
    static belongsToGraph(models) {
        const uniqueKey = this.uniqueKey
        const fields = this.graph().getFields()
        this.belongsTo.filter(m => models.has(m)).forEach(m => {
            const modelClass = models.get(m), key = i(m, 'singular', 'camel')
            fields[key] = {
                name: key,
                type: modelClass.graph(),
                args: [],
                extensions: {
                    joinMonster: {
                        // sqlJoin: (parent, child, args) => `${parent}.${i.singularize(child)}_${modelClass.uniqueKey} = ${child}.${modelClass.uniqueKey}`,
                        sqlBatch: {
                            thisKey: modelClass.uniqueKey,
                            parentKey: `${i(modelClass.table, 'singular')}_${modelClass.uniqueKey}`
                        },
                    }
                }
            }
        })
    }
}

module.exports = {
    Model, FieldType, PropTypes
}
