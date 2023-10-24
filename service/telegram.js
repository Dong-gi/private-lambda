import axios from 'axios'

const a = axios.create({ timeout: 5000 });
const chat_id = 529202433;

/**
 * @param {string} txt 
 */
export function escapeHtmlBody(txt) {
    return txt.replace(/&/gm, '&amp;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;')
}

/**
 * @param {string} token 
 * @param {string} html 
 */
export async function sendHTML(token, html) {
    await a.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id,
        text: html,
        parse_mode: "HTML"
    })
}