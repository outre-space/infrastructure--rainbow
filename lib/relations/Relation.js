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
        this.related = related;
    }

    get case() {}

    get type() {}

    get join() {}

}

module.exports = Relation;
