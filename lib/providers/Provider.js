
class Provider {

    /**
     * @returns {[]}
     */
    static boot() {
        throw 'Base Provider must be extended';
    }
}

module.exports = {Provider}
