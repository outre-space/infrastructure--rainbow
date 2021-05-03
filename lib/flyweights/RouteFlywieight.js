const express = require("express");

class RouteFlyweight {

    /**
     *
     * @type {Map}
     */
    router = new express.Router();

    route(router) {
        this.router = router;
        return this
    }

    add(path, handler) {
        this.router.use(path, handler);
        return this;
    }

}

module.exports = {
    RouteFlyweight: new RouteFlyweight()
}
