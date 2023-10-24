/**
 * @param {string} txt 
 */
export function escapeHtmlBody(txt) {
    return txt.replace(/&/gm, '&amp;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;')
}