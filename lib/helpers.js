
const changeCase = require('change-case')
const {singularize, pluralize} = require('inflection');

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
    // console.log(objects[0])
    const merged = objects.reduce((acc, cur) => ({...acc, ...cur}), {})
    // console.log(merged)
    return merged;
}

module.exports = {i, merge}

