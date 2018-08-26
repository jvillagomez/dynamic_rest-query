// Helper Functions-------------------------------
const convertStringToArray = (arrayString) => {
    let parsedArray = arrayString.replace('[','').replace(']','').split(',')
    return parsedArray
};
// https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
const isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
};
// Processes arrays and single values-------------
const convertIfNumeric = (value) => {
    if(Array.isArray(value)) {
        for (let index = 0; index < value.length; index++) {
            const element = value[index];
            if(isNumeric(element)) {
                value[index] = Number(element)
            }
        }
    } else {
        if(isNumeric(value)) {
            value = Number(value);
        }
    }
    return value
};

export {
    convertStringToArray,
    convertIfNumeric
}