import fs from 'fs';
import { C } from '../constant.js'
import { authLocal } from '../service/google-auth.js'
import { get, set } from '../service/aws-dynamo-db.js'

/**
 * 로컬에서 Google 로그인 후 토큰 설정
 */
export async function exec() {
    if (fs.existsSync(C.LOCAL.TMP_GOOGLE_API_CLIENT_SECRET) == false) {
        const secretTxt = await get(C.DYNAMO_DB.GOOGLE_API_CLIENT_SECRET, true);
        fs.writeFileSync(C.LOCAL.TMP_GOOGLE_API_CLIENT_SECRET, secretTxt);
    }
    const secret = JSON.parse(fs.readFileSync(C.LOCAL.TMP_GOOGLE_API_CLIENT_SECRET).toString()).installed;
    const credentials = await authLocal();
    await set(C.DYNAMO_DB.GOOGLE_API_CLIENT_TOKEN, JSON.stringify({
        type: 'authorized_user',
        client_id: secret.client_id,
        client_secret: secret.client_secret,
        refresh_token: credentials.refresh_token,
    }));
}