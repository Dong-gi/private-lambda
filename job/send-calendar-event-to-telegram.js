import { formatInTimeZone, toDate } from 'date-fns-tz'
import { C } from '../constant.js'
import { get } from '../service/aws-dynamo-db.js';
import { authToken, currentAuthInfo } from '../service/google-auth.js'
import { nextEvents } from '../service/google-calendar.js'
import { sendHTML } from '../service/telegram.js'
import { escapeHtmlBody } from '../util/telegram.js'

/**
 * 곧 시작할 이벤트에 대하여 텔레그램 알림
 */
export async function exec() {
    if (currentAuthInfo() == null)
        await authToken(JSON.parse(await get(C.DYNAMO_DB.GOOGLE_API_CLIENT_TOKEN, true)));

    const eventArr = await nextEvents(10);
    const maxStartTime = new Date(Date.now() + 60_000 * 30);

    const msgArr = eventArr.filter(e => {
        const startTimeTxt = e?.start?.dateTime || e?.start?.date;
        if (!startTimeTxt)
            return false;

        const startTime = toDate(startTimeTxt, { timeZone: 'Asia/Seoul' });
        e.start.dateTime = formatInTimeZone(startTime, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
        return startTime <= maxStartTime;
    }).map(e => `<b>${escapeHtmlBody(e.summary)}</b>@<a href="${e.htmlLink}">${e.start.dateTime}</a>`)

    console.log(`Event count = ${eventArr.length}, target count = ${msgArr.length}`)

    if (msgArr.length > 0)
        await sendHTML(await get(C.DYNAMO_DB.TELEGRAM_BOT_TOKEN, true), msgArr.join('\n'));
}