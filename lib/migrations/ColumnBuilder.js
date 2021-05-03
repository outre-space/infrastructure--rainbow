const knex = require("knex");
const {FieldType} = require("../models/FieldType");
const {db} = require("../database");

class ColumnBuilder {

    columns = {};

    static init() {
        return new ColumnBuilder();
    }

    get defaultOptions() {
        return {
            nullable: true,
            default: undefined,
            type: 'string',
            primary: false,
            increments: false,
            foreign: undefined
        }
    }

    model(config) {
        const {fields, relations, extras, primaryKey} = config;
        this.primary(primaryKey).fields(fields || {})
        if (extras && extras.timestamps) {
            this.timestamps(extras.timestamps)
        }
        return this;
    }

    primary(name) {
        name = name || 'id';
        this.__addColumn(name, {
            ...this.defaultOptions,
            nullable: false,
            primary: true,
            increments: true,
            type: 'integer'
        })
        return this;
    }

    /**
     *
     * @param {{}} fields
     * @return {this}
     */
    fields(fields) {
        Object.keys(fields).forEach(column =>
            this.column(column, fields[column]))
        return this;
    }

    column(name, options) {
        this.__addColumn(name, {
            ...this.defaultOptions,
            ...typeof options === 'string' ? {type: options} : options
        })
        return this;
    }

    timestamps(tms) {
        tms.includes('created') && this.timestamp('created', true)
        tms.includes('updated') && this.timestamp('updated', true)
        tms.includes('deleted') && this.timestamp('deleted')
        return this;
    }

    timestamp(name, defaultNow) {
        this.__addColumn(name, {
            ...this.defaultOptions,
            type: 'timestamp',
            ...defaultNow && {default: db.conn.fn.now()}
        })
        return this;
    }

    belongsTo(related, primary) {
        const name = `${i(related, 'singular')}_${primary}`;
        this.__addColumn(name, {
            ...this.defaultOptions,
            type: 'integer',
            foreign: related
        })
        return this;
    }

    build(fieldNames) {
        return Object.keys(this.columns).map(column =>
            new FieldType(column, this.columns[column], fieldNames[column]))
    }

    __addColumn(name, fields) {
        this.columns[name] = fields;
    }
}

module.exports = {ColumnBuilder}
