const {ModelFlyweight} = require("../flyweights/ModelFlyweight");
const {GraphLoader} = require("../loaders/GraphLoader");

const {Provider} = require("./Provider");

class GraphProvider extends Provider {

    static boot() {
        ModelFlyweight.all.forEach((model) => {
            model.graph = GraphLoader.fromModel(model)
        })
        ModelFlyweight.all.forEach((model) => {
            GraphLoader.fromRelations(model.relations, model)
        })
    }
}

module.exports = {GraphProvider}
