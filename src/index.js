var merge = require('deepmerge'); // neccesary for merging ANDs and ORs

import { parseExpression, combineORexpressions } from './parsing_functions'

const parseQuery = (rawQueryObject) => {
    let argumentList = Object.entries(rawQueryObject);
    let parsedQueries = argumentList.map(keyValueArray => parseExpression(keyValueArray[0],keyValueArray[1]))
    let orArray = [];
    let queryArray = []
    for (let index = 0; index < parsedQueries.length; index++) {
        const attribute = parsedQueries[index];
        if (Object.keys(attribute)[0]===('$or')) {
            orArray.push(attribute)
        } else {
            queryArray.push(attribute)
        }
    }
    let parsedQuery = merge.all(queryArray)
    if (orArray.length > 1) {
        return merge.all(
            [parsedQuery, combineORexpressions(orArray)]
        )
    }
    return merge.all(
        [parsedQuery, orArray[0]]
    )
}

export {
    parseQuery
}