export function getDrawable(util, renderer) {
    const drawableId = util.target.drawableID
    return renderer._allDrawables[drawableId];
}