import fs from 'fs'
import { inspect } from 'util'

console.log('Init job')
/** @type {Map<string, function(...): Promise<any>>} */
const jobMap = new Map();
await Promise.all(
    fs.readdirSync('./job')
        .map(async name => {
            const module = await import(`./job/${name}`);
            console.log(`Set job ${name}`);
            jobMap.set(name, module.exec);
        })
);

/**
 * @param {{jobArr: string[]}} event 
 */
export async function handler(event) {
    console.log(JSON.stringify(event));
    let isAllRight = true;
    await Promise.all(event.jobArr.map(async (name) => {
        console.log(`Start - ${name}`)
        try {
            await jobMap.get(name)();
        } catch (e) {
            isAllRight = false;
            console.log(inspect(e))
        }
        console.log(`End - ${name}`)
    }));
    return isAllRight;
}

// handler({ "jobArr": ["send-calendar-event-to-telegram.js"] })