
const YAML = require('yaml')
const isUrl = require('is-url')
const get = require('get')
let {readFile} = require('fs')
const {promisify} = require('util')
const path = require('path')

readFile = promisify(readFile)

class ConfigLoader {

    static async load(data) {
        if (typeof data !== "string") return data
        data = YAML.parse(data)
        if (typeof data !== "string") return data
        if (isUrl(data)) {
            const g = get(data)
            return YAML.parse(await promisify(g.asString.bind(g))())
        }
        return YAML.parse(await readFile(path.resolve(data), {encoding: "utf-8"}))
    }
}

module.exports = {ConfigLoader}
