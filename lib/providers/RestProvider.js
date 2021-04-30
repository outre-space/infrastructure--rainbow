const {useSofa, OpenAPI} = require('sofa-api')
const path = require('path')
const {Provider} = require("./Provider");

class RestProvider extends Provider {

    static REST_BASE = '/rest'

    static boot() {
        const doc = this.buildDoc();
        return [
            this.REST_BASE, useSofa({
                schema: KERNEL_SCHEMA,
                onRoute: i => {
                    doc.addRoute(i, {basePath: this.REST_BASE,});
                    doc.save(path.resolve('public', 'swagger.json'))
                },
            })
        ]
    }

    static async buildDoc() {
        return OpenAPI({
            schema: KERNEL_SCHEMA,
            info: {
                title: 'Outre Rainbow APIs', contact: {
                    name: "Outre Support",
                    url: "http://www.outrespace.com/support",
                    email: "support@outrespace.com"
                },
                license: {
                    name: "Apache 2.0",
                    url: "https://www.apache.org/licenses/LICENSE-2.0.html"
                },
                version: "1.0.1"
            },
            servers: [
                {url: './'}
            ]
        })
    }
}

module.exports = {RestProvider}
