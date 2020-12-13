
const changeCase = require('change-case')
const {singularize, pluralize} = require('inflection');

function i(verb, ...cases) {
    return cases.reduce((acc, cur) => {
        if (cur === 'plural') return pluralize(acc)
        if (cur === 'singular') return singularize(acc)
        return changeCase[`${cur}Case`](acc);
    }, verb)
}

module.exports = {i}

