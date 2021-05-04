
const isUrl = require('is-url')
const url = require('url');
const path = require('path');
const changeCase = require('change-case')
const {singularize, pluralize} = require('inflection');

/**
 *
 * @param {string} verb
 * @param {string} cases
 * @return {string}
 */
function i(verb, ...cases) {
    return cases.reduce((acc, cur) => {
        if (cur === 'plural') return pluralize(acc)
        if (cur === 'singular') return singularize(acc)
        return changeCase[`${cur}Case`](acc);
    }, verb)
}

/**
 *
 * @param {{}[]} objects
 * @returns {*}
 */
function merge(objects) {
    return objects.reduce((acc, cur) => ({...acc, ...cur}), {});
}

function resolve(base, current) {
    if (isUrl(base)) {
        return url.resolve(base, current);
    }
    return path.resolve(path.dirname(base), current);
}

module.exports = {i, merge, resolve}

