
const knex = require('knex')

const config = {
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        user: 'your_database_user',
        password: 'your_database_password',
        database: 'myapp_test'
    }
}

const path = require('path')

const config2 = {
    client: 'sqlite3',
    connection: {
        filename:  path.resolve('./bin/demo-data.sl3')
    },
    useNullAsDefault: true
}

class Database {

    conn

    constructor() {
        this.conn = knex(config2)
    }

    query(sql) {
        return this.conn.raw(sql)
    }

    async describeTable(table) {
        return this.conn.table(table).columnInfo()
    }

    create(values, table) {
        return this.conn(table).insert(values)
    }

    update(values, table, pk) {
        return this.conn(table)
            .where(Object.defineProperty({}, pk, {value: values[pk], enumerable: true}))
            .update(values)
    }
}

module.exports = new Database()
