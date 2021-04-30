const {GraphQLList, GraphQLNonNull, GraphQLID} = require('graphql')

const {Query} = require("./Query");

class ShowQuery extends Query {

    constructor(model) {
        super(model);
    }

    get type() {
        return this.model.graph();
    }

    get args() {
        return {[this.model.uniqueField]: {type: new GraphQLNonNull(GraphQLID)}};
    }

    get case() {
        return 'singular'
    }

    get extensions() {
        const uniqueKey = this.model.uniqueKey, uniqueField = this.model.uniqueField
        return {
            extensions: {
                joinMonster: {
                    where: (usersTable, args) => {
                        return `${usersTable}.${uniqueKey} = ${args[uniqueField]}`
                    }
                }
            }
        }
    }

    /**
     *
     * @param {typeof QueryModel} model
     * @returns {{}}
     */
    static create(model) {
        return new ShowQuery(model).build();
    }
}

module.exports = {ShowQuery};
