# Dynamic Rest Query

This package allows a Node app to use most of the agregation pipeline oprators--offered by MongoDB--when sending a GET request.
Normally these operators are available through a third party library like Mongoose or Camo, but use of these libraries
forces a developer to implement a schema. This package was created to use in applications where schemas are not possible (research data).

The package is lightweight, written in pure JavaScript, with only one depedency (deepmerge).
Usage of this pkg is incredibly intuitive, with syntax resembling that of MongoDB drivers.

Agregation operators (refer to MongoDB Docs):
* $and 
    * Logical 'and', used to chain multiple comparators together
* $or
    * Logical 'or', used to chain multiple comparators together

* $eq 
    * equal to (implied/need not be specified)
* $ne
    * not equal to
* $lt 
    * less than
* $lte
    * less than or equal to
* $gt 
    * greater than
* $gte 
    * greater than or equal to

* $in 
    * included in specified array
* $nin
    * not included in specified array

## Dependencies
[![NPM Version][npm-image]][https://www.npmjs.com/package/deepmerge]

## Acknowledgments
The page doesnt display the user's info, but his/her's one-liner helped in validating numeric values.
https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric


## Install

```bash
npm i -S dynamic_rest_query
```

## Usage
MongoDB allows for any simple chaining of these aperators, but should be used with caution.
It is recommeneded that you workout the boolean logic to a query, before submitting a bug as the logic itself maybe the cause of unwnated behavior.

### NOTE
* Multiple 'AND' are allowed within a single parameter (since 'AND' are assumed for all parameters evaluated together as one query).
* 'OR' statements are allowed within a single parameter. Multiple OR clauses get coupled together inside of an 'AND' statement.
* 'OR' statements across different attributes is not supported yet.
* If exclusive OR statements (like that mentioned above is neccesary), it can be implemented.
* Pkg supports recursion, so feel free to combine expressions at will.


* There is no limit on how many operators can be used on a single attribute, but it is highly recommended you keep it to 3-4 (max).
* Do not mix OR/AND statements within the same attribute. This may result in unpredictable output.


server_url:8000/data?versionID=someVersion&visitID=*NE*notSomeVisit&sessionID=*IN*[value1,value2,value3]&subjectID=someSubject*OR*someOther&typeID=someType*AND*secondType&age=*GT*22*AND**LT*44


### Formatting Expressions
Input: JavaScript Object conatining key-value pairs specifying your query parameters. Values are written in syntax allowing for aggregation operators to be used inside the value-string.
Output: Formatted JavaScript Object using MongoDB's node agregetors.

* $and 
    * All expressions must evaluate as True. 
    * Wanted: 
        * age = 21 and 22
    * Input (using modules syntax):
        * { age: 21*AND*22 }
    * Output (formatted for MongoDB):
        * { age: { $eq:21, $eq:22 } }
* $or
    * Only one of the expressions must evaluate as True.
    * Wanted: 
        * age = 21 or 22
    * Input (using modules syntax):
        * { age: 21*OR*22 }
    * Output (formatted for MongoDB):
        * { $or: [{ age: { $eq:21 } }, { age: { $eq:22 } }] }

* $eq 
    * equal to (implied/need not be specified)
* $ne
    * not equal to
    * Wanted: 
        * age = not 22
    * Input (using modules syntax):
        * { age: *NE*22 }
    * Output (formatted for MongoDB):
        * { age: { $ne:21 } }
* $lt 
    * less than
    * Wanted: 
        * age < 22
    * Input (using modules syntax):
        * { age: *LT*22 }
    * Output (formatted for MongoDB):
        * { age: { $lt:22 } }
* $lte
    * less than or equal to
    * Wanted: 
        * age <= 22
    * Input (using modules syntax):
        * { age: *LTE*22 }
    * Output (formatted for MongoDB):
        * { age: { $lte:22 } }
* $gt 
    * greater than
    * Wanted: 
        * age > 22
    * Input (using modules syntax):
        * { age: *GT*22 }
    * Output (formatted for MongoDB):
        * { age: { $gt:22 } }
* $gte 
    * greater than or equal to
    * Wanted: 
        * age >= 22
    * Input (using modules syntax):
        * { age: *GTE*22 }
    * Output (formatted for MongoDB):
        * { age: { $gte:22 } }
* $in 
    * included in specified array
    * Wanted: 
        * age is one of the following [21, 22, 23]
    * Input (using modules syntax):
        * { age: *IN*[21,22,23] }
    * Output (formatted for MongoDB):
        * { age: { $in:[21,22,23] } }
* $nin
    * not included in specified array
    * Wanted: 
        * age is not one of the following [21, 22, 23]
    * Input (using modules syntax):
        * { age: *NIN*[21,22,23] }
    * Output (formatted for MongoDB):
        * { age: { $nin:[21,22,23] } }
    
## Examples
* Note how numerical values are automatically turned to numerical data types (whether float, int, array, or array member).

Using ES6
```javascript
import { parseQuery } from 'dynamic_rest_query'

let query = {
    key1:'first',
    key2:'*NE*second',
    key3:'*GT*second',
    key4:'*GTE*second',
    key5:'*LT*second',
    key6:'*LTE*second',
    key7:'*IN*[value1,value2]',
    key8:'*NIN*[nvalue1,nvalue2]',
    key9:'*GT*56*OR**LT*48'
}
console.log(
    parseQuery(query)
)

// Outputs
// { 
//   key1: { '$eq': 'first' },
//   key2: { '$ne': 'second' },
//   key3: { '$gt': 'second' },
//   key4: { '$gte': 'second' },
//   key5: { '$lt': 'second' },
//   key6: { '$lte': 'second' },
//   key7: { '$in': [ 'value1', 'value2' ] },
//   key8: { '$nin': [ 'nvalue1', 'nvalue2' ] },
//   key9: { $or: [{ age: { $gt:56 } }, { age: { $lt:48 } }] }
// }
```

Using ECMA2015
```javascript
var pkg = require('dynamic_rest_query')

var query = {
    key1:'first',
    key2:'*NE*second',
    key3:'*GT*second',
    key4:'*GTE*second',
    key5:'*LT*second',
    key6:'*LTE*second',
    key7:'*IN*[21,22]',
    key8:'*NIN*[23,24]',
    key9:'*GT*56*OR**LT*48'
}
console.log(
    pkg.parseQuery(query)
)

// Outputs
// { 
//   key1: { '$eq': 'first' },
//   key2: { '$ne': 'second' },
//   key3: { '$gt': 'second' },
//   key4: { '$gte': 'second' },
//   key5: { '$lt': 'second' },
//   key6: { '$lte': 'second' },
//   key7: { '$in': [ 21, 22 ] },
//   key8: { '$nin': [ 23, 24 ] },
//   key9: { $or: [{ age: { $gt:56 } }, { age: { $lt:48 } }] }
// }
```

* When an 'OR' expression is found for mroe than one argument, they get merged inside of an 'AND' expression. This simplifies the boolean expression, but does not affect the desire value.

Using ES6
```javascript
import { parseQuery } from 'dynamic_rest_query'

let query = {
    key1:'first',
    key2:'*NE*second',
    key3:'*GT*second',
    key4:'*GTE*second',
    key5:'*LT*second',
    key6:'*LTE*second',
    key7:'*IN*[value1,value2]',
    key8:'*NIN*[nvalue1,nvalue2]',
    key9:'*GT*56*OR**LT*48',
    key10:'*GT*21*OR**LT*26'
}
console.log(
    parseQuery(query)
)

// Outputs
// { 
//   key1: { '$eq': 'first' },
//   key2: { '$ne': 'second' },
//   key3: { '$gt': 'second' },
//   key4: { '$gte': 'second' },
//   key5: { '$lt': 'second' },
//   key6: { '$lte': 'second' },
//   key7: { '$in': [ 'value1', 'value2' ] },
//   key8: { '$nin': [ 'nvalue1', 'nvalue2' ] },
//   '$and': [ 
//       { $or: [{ age: { $gt:56 } }, { age: { $lt:48 } }] }, 
//       { $or: [{ age: { $gt:21 } }, { age: { $lt:26 } }] } 
//     ] 
// }
```

Using ECMA2015
```javascript
var pkg = require('dynamic_rest_query')

let query = {
    key1:'first',
    key2:'*NE*second',
    key3:'*GT*second',
    key4:'*GTE*second',
    key5:'*LT*second',
    key6:'*LTE*second',
    key7:'*IN*[value1,value2]',
    key8:'*NIN*[nvalue1,nvalue2]',
    key9:'*GT*56*OR**LT*48',
    key10:'*GT*21*OR**LT*26'
}
console.log(
    pkg.parseQuery(query)
)

// Outputs
// { 
//   key1: { '$eq': 'first' },
//   key2: { '$ne': 'second' },
//   key3: { '$gt': 'second' },
//   key4: { '$gte': 'second' },
//   key5: { '$lt': 'second' },
//   key6: { '$lte': 'second' },
//   key7: { '$in': [ 'value1', 'value2' ] },
//   key8: { '$nin': [ 'nvalue1', 'nvalue2' ] },
//   '$and': [ 
//       { $or: [{ age: { $gt:56 } }, { age: { $lt:48 } }] }, 
//       { $or: [{ age: { $gt:21 } }, { age: { $lt:26 } }] } 
//     ] 
// }
```


## License

[MIT](http://vjpr.mit-license.org)

[npm-url]: https://npmjs.org/package/dynamic_rest_query