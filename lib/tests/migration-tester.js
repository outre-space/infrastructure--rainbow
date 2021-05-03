const {Migration} = require("../migrations/Migration");
const {ConfigLoader} = require("../loaders/ConfigLoader");

ConfigLoader.loadConfig("./public/models/Account.yml").then(config => {
    const builder = new Migration(config, 'Account').run();
    console.log(builder)
})
