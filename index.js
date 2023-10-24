import { inspect } from 'util'

console.log('init')

/**
 * @param {{jobArr: string[]}} event 
 */
export async function handler(event) {
    console.log(JSON.stringify(event));
    let isAllRight = true;
    await Promise.all(event.jobArr.map(async (name) => {
        console.log(`START - ${name}`)
        try {
            const job = await import(`./job/${name}.js`);
            await job.exec();
        } catch (e) {
            isAllRight = false;
            console.log(inspect(e))
        }
        console.log(`END - ${name}`)
    }));
    return isAllRight;
}

//handler({ jobArr: ['send-calendar-event-to-telegram'] })