const {GraphQLList, GraphQLNonNull, GraphQLID} = require('graphql')
const {Model} = require('./Model')

const {i} = require('./helpers')

const joinMonster = require('join-monster').default
const db = require('./database')

class QueryModel extends Model {

    static readonly = []
    static queryScheme = 'snake'

    static queries() {
        const graph = this.graph()
        const resp = [this._queryList(graph), this._queryShow(graph)]
        return resp.reduce((acc, [key, value]) => Object.defineProperty(acc, key, {value, enumerable: true}), {})
    }

    static mutations() {
        const graph = this.graph()
        const resp = [this._querySave(graph)]
        return resp.reduce((acc, [key, value]) => Object.defineProperty(acc, key, {value, enumerable: true}), {})
    }


    static _queryList(graph) {
        return [
            i(this.className, 'plural', this.queryScheme),
            {
                type: GraphQLList(graph),
                resolve: this.resolve.bind(this)
            }
        ]
    }

    static _queryShow(graph) {
        const uniqueKey = this.uniqueKey, uniqueField = this.fieldName(uniqueKey)
        return [
            i(this.className, 'singular', this.queryScheme),
            {
                type: graph,
                args: Object.defineProperty({}, uniqueField, {
                    value: {type: new GraphQLNonNull(GraphQLID)},
                    enumerable: true
                }),
                extensions: {
                    joinMonster: {
                        where: (usersTable, args) => {
                            return `${usersTable}.${uniqueKey} = ${args[uniqueField]}`
                        }
                    }
                },
                resolve: this.resolve.bind(this)
            }
        ]
    }

    static _querySave(graph) {
        const uniqueKey = this.uniqueKey, uniqueField = this.fieldName(uniqueKey)
        return [
            i(this.className, 'singular', this.queryScheme),
            {
                type: graph,
                args: this.__resolveArgs(),
                resolve: this.resolveSave.bind(this)
            }
        ]
    }

    static __resolveArgs() {
        const args = this.__fields.filter(f => !this.readonly.includes(f))
            .reduce((acc, f) => {
                return Object.defineProperty(acc, f.name, {
                    value: {type: f.nullable ? f.graphType : new GraphQLNonNull(f.graphType)},
                    enumerable: true
                });
            }, {})
        return args
    }

    static resolve(parent, args, context, resolveInfo) {
        return joinMonster(resolveInfo, context, db.query.bind(db))
    }

    static async resolveSave(parent, args) {
        args = Object.keys(args).reduce((acc, key) => ({...acc, [this.columnName(key)]: args[key]}), {})
        const res = await (args.hasOwnProperty(this.uniqueKey) ? db.update(args, this.table, this.uniqueKey) : db.create(args, this.table))
            .returning(this.uniqueKey)
        return res
    }

}

module.exports = {QueryModel}
