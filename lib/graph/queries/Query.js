
const joinMonster = require('join-monster').default
const {i} = require('../../helpers')
const db = require('../../database')

class Query {

    /**
     * @type {typeof QueryModel} model
     */
    model;

    constructor(model) {
        this.model = model;
    }

    get type() {}

    get args() {}

    get extensions() {}

    get case() {
        return 'singular'
    }

    build() {
        return {
            [i(this.model.className, this.case, this.model.queryScheme)]:
            {
                type: this.type,
                args: this.args,
                extensions: this.extensions,
                resolve: this.resolve.bind(this.model)
            }
        }
    }

    resolve(parent, args, context, resolveInfo) {
        return joinMonster(resolveInfo, context, db.query.bind(db))
    }
}

module.exports = {Query};
