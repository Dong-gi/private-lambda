import { google } from 'googleapis'
import { currentAuthInfo } from './google-auth.js'

//삭제된 이벤트
//{
//    kind: 'calendar#event',
//    etag: '"3285419212336000"',
//    id: 'xxx',
//    status: 'cancelled'
//}

//활성 이벤트
//{
//    kind: 'calendar#event',
//    etag: '"3283799260368000"',
//    id: 'xxx',
//    status: 'confirmed',
//    htmlLink: 'https://www.google.com/calendar/event?eid=xxx',
//    created: '2022-01-11T11:10:22.000Z',
//    updated: '2022-01-11T11:13:50.184Z',
//    summary: 'test',
//    creator: { email: 'xxx@gmail.com', self: true },
//    organizer: { email: 'xxx@gmail.com', self: true },
//    start: { dateTime: '2022-01-11T20:15:00+09:00', timeZone: 'Asia/Seoul' },
//    end: { dateTime: '2022-01-11T20:15:00+09:00', timeZone: 'Asia/Seoul' },
//    iCalUID: 'xxx@google.com',
//    sequence: 2,
//    reminders: { useDefault: true },
//    eventType: 'default'
//}

/**
 * @param {number} maxResults 
 */
export async function nextEvents(maxResults) {
    const calendar = google.calendar({ version: 'v3', auth: currentAuthInfo() });
    const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults,
        singleEvents: true,
        orderBy: 'startTime',
    });
    return res.data.items || [];
}
