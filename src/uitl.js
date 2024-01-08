export function getDrawable(util, renderer) {
    const drawableId = util.target.drawableID
    return renderer._allDrawables[drawableId];
}
export function range(x, min, max) {
    return Math.max(Math.min(x, max), min)
}
export function round(floor, x) {
    return floor ? Math.floor(x) : Math.ceil(x)
}

// 分割json，每份chunkSize个
export function splitJSON(jsonObj, chunkSize) {
    const keys = Object.keys(jsonObj);
    const chunks = [];

    for (let i = 0; i < keys.length; i += chunkSize) {
        const chunkKeys = keys.slice(i, i + chunkSize);
        const chunkObj = {};

        for (const key of chunkKeys) {
            chunkObj[key] = jsonObj[key];
        }

        chunks.push(chunkObj);
    }

    return chunks;
}