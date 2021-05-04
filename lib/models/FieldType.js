
const {
    GraphQLObjectType,
    GraphQLBoolean,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
} = require('graphql')

const {PropTypes} = require('./PropTypes')

class FieldType {

    column;
    nullable;
    default;
    type;
    primary;
    increments;
    foreign;
    _name;

    constructor(column, {nullable, default: df, type, primary, increments, foreign}, name) {
        this.column = column;
        this.nullable = nullable;
        this.default = df;
        this.type = type;
        this.primary = primary;
        this.increments = increments;
        this.foreign = foreign;
        this._name = name;
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

module.exports = {FieldType}
