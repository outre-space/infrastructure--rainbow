const {GraphQLObjectType,} = require('graphql')

const {i} = require('../helpers');
const {Relation} = require("../relations/Relation");

const {FieldType} = require("./FieldType");
const {PropTypes} = require("./PropTypes");

class Model {

    static _table
    static _uniqueKey
    static fieldNames = {}
    static className = 'Model';
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
    static graph
    /**
     * @type {Array<FieldType>}
     * @private
     */
    static fields

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
