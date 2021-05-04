const Relation = require("./Relation");
const {GraphQLList} = require("graphql");
const {i} = require("../helpers");

class HasManyRelation extends Relation {

    constructor(related) {
        super(related);
    }

    get case() {
        return 'plural';
    }

    get type() {
        return new GraphQLList(this.relatedModel.graph);
    }

    get join() {
        return {
            // sqlJoin: (parent, child, args) => `${parent}.${uniqueKey} = ${child}.${i.singularize(parent)}_${uniqueKey}`
            sqlBatch: {
                thisKey: `${i(this.model.table, 'singular')}_${this.model.uniqueKey}`,
                parentKey: this.model.uniqueKey
            },
        };
    }

}

module.exports = {HasManyRelation}
