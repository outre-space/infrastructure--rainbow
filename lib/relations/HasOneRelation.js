const Relation = require("./Relation");
const {i} = require("../helpers");

class HasOneRelation extends Relation {

    constructor(related) {
        super(related);
    }

    get case() {
        return 'singular';
    }

    get type() {
        return this.relatedModel.graph;
    }

    get join() {
        return {
            // sqlJoin: (parent, child, args) => `${parent}.${uniqueKey} = ${child}.${i.singularize(child)}_${modelClass.uniqueKey}`,
            sqlBatch: {
                thisKey: `${i(this.model.table, 'singular')}_${this.model.uniqueKey}`,
                parentKey: this.model.uniqueKey
            },
        };
    }

}

module.exports = {HasOneRelation}
