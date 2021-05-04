const Relation = require("./Relation");
const {i} = require("../helpers");

class BelongsToRelation extends Relation {

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
                thisKey: this.relatedModel.uniqueKey,
                parentKey: `${i(this.relatedModel.table, 'singular')}_${this.relatedModel.uniqueKey}`
            },
        };
    }

}

module.exports = {BelongsToRelation}
