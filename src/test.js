import { parseQuery } from './index'

// let query = {
//     key1:'first',
//     key2:'*NE*second',
//     key3:'*GT*second',
//     key4:'*GTE*second',
//     key5:'*LT*second',
//     key6:'*LTE*second',
//     key7:'*IN*[value1,value2]',
//     key8:'*NIN*[nvalue1,nvalue2]',
//     key9:'*GT*56*OR**LT*48',
//     key10:'*GT*56*OR**LT*48'
// }
// console.log(parseQuery(query))


let query = {
    key1: true,
}
console.log(parseQuery(query))
