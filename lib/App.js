/**
 *
 * @type {typeof Provider[]}
 */
const {RouteFlyweight} = require("./flyweights/RouteFlywieight");
const {ModelProvider} = require("./providers/ModelProvider");
const {Kernel} = require("./Kernel");
const {GraphProvider} = require("./providers/GraphProvider");
const {HttpProvider} = require("./providers/HttpProvider");

const providers = [
    ModelProvider,
    GraphProvider,
    HttpProvider,
]

class App {

    static async start() {
        await Kernel.boot(process.env.CONFIG_URL)
        for (const p of providers) await p.boot();
        return RouteFlyweight.router;
    }
}

module.exports = App;
