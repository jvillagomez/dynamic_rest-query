import { convertStringToArray, convertIfNumeric } from './helper_functions'
import merge from 'deepmerge'

// GREATER THAN
var parseGTexpression = (keyValueArray) => {
    var parsedEntry = {};
    var operand = keyValueArray[1].replace('*GT*','');
    parsedEntry[keyValueArray[0]] = {
        $gt: convertIfNumeric(operand)
    }
    return parsedEntry
};
// GREATER THAN OR EQUAL TO
var parseGTEexpression = (keyValueArray) => {
    var parsedEntry = {};
    var operand = keyValueArray[1].replace('*GTE*','');
    parsedEntry[keyValueArray[0]] = {
        $gte: convertIfNumeric(operand)
    }
    return parsedEntry
};
// LESSER THAN
var parseLTexpression = (keyValueArray) => {
    var parsedEntry = {};
    var operand = keyValueArray[1].replace('*LT*','');
    parsedEntry[keyValueArray[0]] = {
        $lt: convertIfNumeric(operand)
    }
    return parsedEntry
};
// LESSER THAN OR EQUAL TO
var parseLTEexpression = (keyValueArray) => {
    var parsedEntry = {};
    var operand = keyValueArray[1].replace('*LTE*','');
    parsedEntry[keyValueArray[0]] = {
        $lte: convertIfNumeric(operand)
    }
    return parsedEntry
};
// NOT EQUAL TO
var parseNEexpression = (keyValueArray) => {
    var parsedEntry = {};
    var operand = keyValueArray[1].replace('*NE*','');
    parsedEntry[keyValueArray[0]] = {
        $ne: convertIfNumeric(operand)
    }
    return parsedEntry
};
// IS IN group
var parseINexpression = (keyValueArray) => {
    var parsedEntry = {};
    var operands = keyValueArray[1].replace('*IN*','');
    var parsedArray = convertStringToArray(operands);
    parsedEntry[keyValueArray[0]] = {
        $in: convertIfNumeric(parsedArray)
    }
    return parsedEntry
};
// IS NOT IN group
var parseNINexpression = (keyValueArray) => {
    var parsedEntry = {};
    var operands = keyValueArray[1].replace('*NIN*','');
    var parsedArray = convertStringToArray(operands);
    parsedEntry[keyValueArray[0]] = {
        $nin: convertIfNumeric(parsedArray)
    }
    return parsedEntry
};
// IS EQUAL TO
var parseEQexpression = (keyValueArray) => {
    var parsedEntry = {};
    parsedEntry[keyValueArray[0]] = {
        $eq: convertIfNumeric(keyValueArray[1])
    }
    return parsedEntry
};

var parseEXISTSexpression = (keyValueArray) => {
    var parsedEntry = {};
    parsedEntry[keyValueArray[0]] = {
        $exists: keyValueArray[1]
    }
    return parsedEntry
};

const parseExpression = (key, expression) => {
    if (typeof(expression) === 'boolean') {
        return parseEQexpression([key, expression]);
    }
    if (expression.includes('*OR*')) {
        return parseORexpression([key , expression]);    
    } else if (expression.includes('*AND*')) {
        return parseANDexpression([key , expression]);        
    } else if (expression.includes('*exists*')) {
        return parseEXISTSexpression([key , true]);
    } else if (expression.includes('*GT*')) {
        return parseGTexpression([key , expression]);
    } else if (expression.includes('*GTE*')) {
        return parseGTEexpression([key , expression]);        
    } else if (expression.includes('*LT*')) {
        return parseLTexpression([key , expression]);        
    } else if (expression.includes('*LTE*')) {
        return parseLTEexpression([key , expression]);        
    } else if (expression.includes('*NE*')) {
        return parseNEexpression([key , expression]);        
    } else if (expression.includes('*IN*')) {
        return parseINexpression([key , expression]);        
    } else if (expression.includes('*NIN*')) {
        return parseNINexpression([key , expression]);        
    }
    return parseEQexpression([key , expression]);
};

var parseANDexpression = (keyValueArray) => {
    var _key = keyValueArray[0];
    var expressions = keyValueArray[1].split('*AND*');
    var arrayOfExpressions = [];
    expressions.forEach(expression => {
        let parsedExpression = parseExpression(_key, expression)
        arrayOfExpressions.push(parsedExpression);
    });
    var parsedANDforSingleParamater = merge.all(arrayOfExpressions);
    return parsedANDforSingleParamater
};

var parseORexpression = (keyValueArray) => {
    var _key = keyValueArray[0];
    var expressions = keyValueArray[1].split('*OR*');
    var arrayOfExpressions = [];
    expressions.forEach(expression => {
        let parsedExpression = parseExpression(_key, expression)
        arrayOfExpressions.push(parsedExpression);
    });
    var parsedORforSingleParamater = {
        $or: arrayOfExpressions
    }
    return parsedORforSingleParamater
};

const combineORexpressions = (orArray) => {
    return {
        $and: orArray
    }
};

export {
    parseExpression,
    combineORexpressions
}