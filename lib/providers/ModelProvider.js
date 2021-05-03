const {ModelFlyweight} = require("../flyweights/ModelFlyweight");
const {ModelLoader} = require("../loaders/ModelLoader");
const {ConfigLoader} = require("../loaders/ConfigLoader");
const {Provider} = require("./Provider");
const {resolve} = require('../helpers')

class ModelProvider extends Provider {

    static async boot() {
        await Promise.all(KERNEL_CONFIG.resources.map(this.loadModel));
    }

    static async loadModel(resource) {
        const model = await ConfigLoader.loadConfig(resolve(CONFIG_URL, resource.ref))
        ModelFlyweight.add(resource.name, ModelLoader.instantiate(model, resource))
    }
}

module.exports = {ModelProvider}
