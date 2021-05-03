const {i} = require("../helpers");
const {ColumnBuilder} = require("./ColumnBuilder");

class Migration {

    config;
    modelName;

    constructor(config, modelName) {
        this.config = config;
        this.modelName = modelName;
    }

    run() {
        return ColumnBuilder.init().model(this.config).build({});
    }

    get table() {
        return this.config.table ? this.config.table : i(this.className, 'plural', 'snake');
    }

    get primary() {
        return this.config.primaryKey || 'id';
    }
}

module.exports = {Migration}
