/**
 * @template {any} T
 * @param {function(...): Promise<T>} asyncFunction 
 * @returns {function(...): Promise<T>} New wrapper of asyncFunction
 */
export function retry(asyncFunction) {
    const cause = new Error('Previous stack');
    const f = async function () {
        while (true) {
            f.triedCount++;
            try {
                return await asyncFunction(...arguments);
            } catch (e) {
                if (f.triedCount >= 5) {
                    e.cause = cause;
                    throw e;
                }
                await sleep(f.baseSleepMs * Math.pow(2, f.triedCount - 1));
            }
        }
    };
    f.triedCount = 0;
    f.baseSleepMs = 10 + Math.floor(Math.random(22));
    return f;
}

/**
 * @param {number} ms 
 */
export async function sleep(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}