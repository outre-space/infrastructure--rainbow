const joinMonster = require('join-monster').default
const {GraphQLList, GraphQLNonNull, GraphQLID} = require('graphql')

const {i} = require('../helpers')
const {db} = require('../database')

class Mutation {

    /**
     * @type {typeof Model} model
     */
    model;

    constructor(model) {
        this.model = model;
    }

    /**
     *
     * @param {typeof Model} model
     * @returns {{}}
     */
    static create(model) {
        return new Mutation(model).build();
    }

    get type() {}

    get args() {
        return this.model.fields
            .filter(f => !this.model.readonly.includes(f) || this.model.uniqueKey === f.column)
            .reduce((acc, f) => ({
                ...acc, [f.name]: {type: f.nullable ? f.graphType : new GraphQLNonNull(f.graphType)}
            }), {[this.model.uniqueField]: GraphQLID})
    }

    get extensions() {
    }

    get case() {
        return 'singular'
    }

    build() {
        return {
            [i(this.model.className, this.case, KERNEL_CONFIG.exports.scheme)]:
            {
                type: this.model.graph,
                args: this.args,
                resolve: this.resolve.bind(this.model)
            }
        }
    }

    /**
     *
     * @param parent
     * @param args
     * @param context
     * @param resolveInfo
     * @this {typeof Model}
     * @return {Promise<*>}
     */
    async resolve(parent, args, context, resolveInfo) {
        args = Object.keys(args).reduce((acc, key) => ({...acc, [this.columnName(key)]: args[key]}), {})
        return await (
            args.hasOwnProperty(this.uniqueKey) ?
                db.update(args, this.table, this.uniqueKey) :
                db.create(args, this.table)
        ).returning(this.uniqueKey)
    }
}

module.exports = {Mutation};
