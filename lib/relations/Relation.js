const {ModelFlyweight} = require("../flyweights/ModelFlyweight");
const {i} = require("../helpers");

class Relation {

    /**
     * @type {typeof Model}
     */
    model;
    /**
     * @type {typeof Model}
     */
    relatedModel;
    /**
     * @type {string} related
     */
    related;

    /**
     *
     * @param {string} related
     */
    constructor(related) {
        this.model = model;
        this.related = related;
    }

    get case() {}

    get type() {}

    get join() {}

    graph(model) {
        this.model = model;
        this.relatedModel = ModelFlyweight.get(this.related);
        const key = i(this.related, this.case, 'camel')
        return [
            key,
            {
                name: key,
                type: this.type,
                args: [],
                extensions: {
                    joinMonster: this.join
                }
            }
        ]
    }
}

module.exports = Relation;
