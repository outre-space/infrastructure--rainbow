
class MigrationRunner {

    table;
    columns = {};

    constructor(table) {
        this.table = table;
    }

    static init(table) {
        return new MigrationRunner();
    }

}

module.exports = {MigrationRunner}
