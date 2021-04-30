const {GraphQLList} = require('graphql')

const {Query} = require("./Query");

class IndexQuery extends Query {

    get type() {
        return GraphQLList(this.model.graph());
    }

    get args() {
        return undefined;
    }

    get extensions() {
        return undefined;
    }

    get case() {
        return 'plural'
    }

    /**
     *
     * @param {typeof QueryModel} model
     * @returns {{}}
     */
    static create(model) {
        return new IndexQuery(model).build();
    }
}

module.exports = {IndexQuery};
