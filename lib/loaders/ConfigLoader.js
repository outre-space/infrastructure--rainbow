
const YAML = require('yaml')
const isUrl = require('is-url')
const get = require('get')
const {readFileSync} = require('fs')
const {promisify} = require('util')
const path = require('path')

class ConfigLoader {

    static loadFile(data) {
        if (typeof data !== "string") return data
        data = YAML.parse(data)
        if (typeof data !== "string") return data
        return YAML.parse(readFileSync(path.resolve(data), {encoding: "UTF-8"}))
    }

    static async load(data) {
        if (typeof data !== "string") return data
        data = YAML.parse(data)
        if (typeof data !== "string") return data
        if (isUrl(data)) {
            const g = get(data)
            return YAML.parse(await promisify(g.asString.bind(g))())
        }
        return YAML.parse(readFileSync(path.resolve(data), {encoding: "UTF-8"}))
    }

    static async loadConfig(data) {
        if (typeof data !== "string") return data
        data = YAML.parse(data)
        if (typeof data !== "string") return data
        if (isUrl(data)) {
            const g = get(data)
            return YAML.parse(await promisify(g.asString.bind(g))())
        }
        return YAML.parse(readFileSync(path.resolve(data), {encoding: "UTF-8"}))
    }

}

module.exports = {ConfigLoader}
