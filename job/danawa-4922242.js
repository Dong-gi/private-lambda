import { C } from '../constant.js'
import { get } from '../service/aws-dynamo-db.js';
import { checkDanawaPrice } from '../service/danawa.js'
import { sendHTML } from '../service/telegram.js'
import { escapeHtmlBody } from '../util/telegram.js'

/**
 * 다나와 가격 알림
 * 
 * https://prod.danawa.com/info/?pcode=4922242
 * (주)문화상품권 [핀번호] 온라인 문화상품권 (5만원권)
 */
export async function exec() {
    const result = await checkDanawaPrice(4922242);

    await sendHTML(
        await get(C.DYNAMO_DB.TELEGRAM_BOT_TOKEN, true),
        `<a href="${result.url}">${escapeHtmlBody(result.productName)}</a>\n\n` +
        result.priceArr.map(p => `<b>${escapeHtmlBody(p.mall)}</b> : <a href="${p.url}">${p.price}원</a>`).join('\n')
    );
}