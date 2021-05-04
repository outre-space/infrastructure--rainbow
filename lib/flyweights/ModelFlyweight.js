
class ModelFlyweight {

    /**
     *
     * @type {Map<string, typeof Model>}
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

    get all() {
        return Array.from(this.models.values());
    }
}

module.exports = {
    ModelFlyweight: new ModelFlyweight()
}
