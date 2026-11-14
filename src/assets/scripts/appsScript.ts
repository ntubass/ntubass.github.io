import { APPS_SCRIPT_URL } from '@data/firebase';
import { getIdToken } from '@scripts/auth';

/**
 * 呼叫系學會網站的 Apps Script（apps-script/site-backend.gs）：信箱驗證與場地預約通知。
 * 每次都帶上 Firebase 登入憑證，Apps Script 會用它確認是誰送的。
 */

export const appsScriptReady = !!APPS_SCRIPT_URL;

export class AppsScriptError extends Error {
  constructor(
    public code: string,
    /** 驗證碼錯誤時，還剩幾次可以試 */
    public left?: number
  ) {
    super(code);
  }
}

export async function callAppsScript<T = Record<string, unknown>>(
  payload: Record<string, unknown>
): Promise<T> {
  const idToken = await getIdToken();
  // 用純文字送出，避免瀏覽器先發 CORS 預檢請求（Apps Script 不處理預檢）
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({ ...payload, idToken }),
  });
  const data = (await res.json()) as { ok: boolean; error?: string; left?: number } & T;
  if (!data.ok) throw new AppsScriptError(data.error ?? 'server', data.left);
  return data;
}
