
const YAML = require('yaml')
const isUrl = require('is-url')

const {ConfigLoader} = require('./lib/ConfigLoader')

ConfigLoader.load(`config/config.yml`
).then(console.log)


