import crypto from 'crypto'
import https from 'https'
import axios from 'axios'
import { JSDOM } from 'jsdom'

const a = axios.create({ timeout: 5000 })

/**
 * @param {number | string} pcode 
 */
export async function checkDanawaPrice(pcode) {
    const url = `https://prod.danawa.com/info/?pcode=${pcode}`
    const res = await a.get(url, {
        httpsAgent: new https.Agent({ secureOptions: crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION })
    })
    const dom = new JSDOM(res.data);
    const result = {
        url,
        productName: dom.window.document.querySelector('.prod_tit .title').textContent.trim(),
        /** @type {{mall: string, price: number, url: string}[]} */
        priceArr: []
    }
    dom.window.document.querySelectorAll('tbody.high_list>tr').forEach(tr => {
        if (tr.classList.contains('product-pot'))
            return
        const mallImg = tr.querySelector('td:nth-child(1) img');
        const priceAnchor = tr.querySelector('td:nth-child(2) a');
        result.priceArr.push({
            mall: mallImg?.alt || '?',
            price: parseInt(priceAnchor.textContent.replace(/\D/gm, '').trim()),
            url: priceAnchor.href
        })
    })
    return result;
}