/**
 * Creates an array of key,value pairs from an object.
 * Eg Input: { description: 'desc', url: 'desc' }
 * Eg Output: [ { description: 'desc' }, { url: 'desc' } ]
 */
function convertObjectToArrayOfObjects(objectData: any): any[] | undefined {
    if (!objectData) return undefined;
    let res = Object.keys(objectData)
        // iterate over them and generate the array
        .map(function (k) {
            // generate the array element
            console.log(k);
            return { [k]: objectData[k] };
        });
    return res;
}
