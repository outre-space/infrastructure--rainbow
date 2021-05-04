const {ShowQuery} = require("./queries/ShowQuery");
const {IndexQuery} = require("./queries/IndexQuery");
const {GraphQLSchema} = require("graphql");
const {Mutation} = require("./mutations/Mutation");
const {merge} = require("./helpers");
const {GraphQLObjectType} = require("graphql");
const {ConfigLoader} = require("./loaders/ConfigLoader");

class Kernel {

    /**
     *
     * @returns {Promise<void>}
     */
    static async boot(path) {
        global.CONFIG_URL = path;
        global.KERNEL_CONFIG = await ConfigLoader.loadConfig(path)
    }
}

module.exports = {Kernel}
