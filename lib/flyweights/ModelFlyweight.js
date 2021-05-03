
class ModelFlyweight {

    /**
     *
     * @type {Map}
     */
    models = new Map();

    set(models) {
        Object.keys(models).forEach(name => this.add(name, models[name]))
        return this;
    }

    add(name, model) {
        this.models.set(name, model);
        return this;
    }

    get(name) {
        return this.models.get(name);
    }
}

module.exports = {
    ModelFlyweight: new ModelFlyweight()
}
