import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ExecuteStatementCommand } from '@aws-sdk/lib-dynamodb'
import { retry } from '../util/function.js'

/** @type {Map<string, string>} */
const cache = new Map();
const ddbClient = new DynamoDBClient({ region: 'ap-south-1' });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

/**
 * @param {string} name 
 * @param {boolean} useCache 
 */
export async function get(name, useCache) {
    if (useCache && cache.has(name))
        return cache.get(name);

    const command = new ExecuteStatementCommand({
        Statement: `select val from private_table where name=?`,
        ConsistentRead: false,
        Parameters: [name]
    });

    const res = await retry(async () => await ddbDocClient.send(command))();
    if (res?.Items.length > 0) {
        const val = res.Items[0].val;
        cache.set(name, val);
        return val;
    }
    return null;
}

/**
 * @param {string} name 
 * @param {string} val 
 */
export async function set(name, val) {
    const command = new UpdateItemCommand({
        Key: { name: { S: name } },
        TableName: 'private_table',
        ExpressionAttributeValues: { ":val": { S: val } },
        UpdateExpression: 'set val = :val'
    });

    await retry(async () => await ddbClient.send(command))();

    cache.set(name, val);
}