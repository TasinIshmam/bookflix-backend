/**
 * Creates an array of key,value pairs from an object.
 * Eg Input: { description: 'desc', url: 'desc' }
 * Eg Output: [ { description: 'desc' }, { url: 'desc' } ]
 */
export function convertObjectToArrayOfObjects(
    objectData: any,
): any[] | undefined {
    if (!objectData) return undefined;
    let res = Object.keys(objectData)
        // iterate over them and generate the array
        .map(function (k) {
            // generate the array element
            return { [k]: objectData[k] };
        });
    return res;
}

/**
 * Shuffles array in place. ES6 version.
 * Warning: Array destructuring syntax may have undesirable performance characteristics.
 * Code source: https://stackoverflow.com/a/6274381/8855844
 * @param {Array} arrayToShuffle items An array containing the items.
 */
export function shuffle<E>(arrayToShuffle: E[]): E[] {
    for (let i = arrayToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayToShuffle[i], arrayToShuffle[j]] = [
            arrayToShuffle[j],
            arrayToShuffle[i],
        ];
    }
    return arrayToShuffle;
}

/**
 * Remove duplicate objects which have matching value of object[idFieldName]
 * Source: https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects
 * @param arrayOfObjects
 * @param idFieldName
 */
export function removeDuplicatesFromArray<E>(
    arrayOfObjects: E[],
    idFieldName: string,
): E[] {
    let idMap = arrayOfObjects.map((entry) => entry[idFieldName]);

    let filtered = arrayOfObjects.filter(
        (entry, index) => !idMap.includes(entry[idFieldName], index + 1),
    );
    return filtered;
}
