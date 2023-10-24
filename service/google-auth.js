import { google } from 'googleapis'
import { authenticate } from '@google-cloud/local-auth'
import { C } from '../constant.js'

let authInfo = null;

export async function authLocal() {
    const client = await authenticate({
        keyfilePath: C.LOCAL.TMP_GOOGLE_API_CLIENT_SECRET,
        scopes: [
            'https://www.googleapis.com/auth/calendar',
        ]
    })
    authInfo = client;
    return client.credentials;
}

export async function authToken(credentials) {
    authInfo = google.auth.fromJSON(credentials);
}

export function currentAuthInfo() {
    return authInfo;
}