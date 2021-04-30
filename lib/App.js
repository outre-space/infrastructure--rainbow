/**
 *
 * @type {typeof Provider[]}
 */
const {Kernel} = require("./Kernel");
const {GraphProvider} = require("./providers/GraphProvider");
const {RestProvider} = require("./providers/RestProvider");

const providers = [
    GraphProvider,
    // RestProvider,
]

class App {

    static async start(router) {
        await Kernel.boot(process.env.CONFIG_URL)
        providers.map(p => p.boot())
            .forEach(([key, value]) => router.use(key, value));
        return router;
    }
}

module.exports = App;
