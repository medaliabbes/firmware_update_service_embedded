// src/lib/api.js
import { PUBLIC_API_URL } from '$env/static/public';
import { getAccessToken } from '$lib/auth.js';

/** @typedef {Omit<RequestInit, 'body' | 'headers'> & { fetch?: typeof fetch, headers?: Record<string, string>, body?: unknown }} ApiOptions */

/** @param {Record<string, string>} [headers] @param {boolean} [json] */
async function authenticatedHeaders(headers = {}, json = true) {
  const token = await getAccessToken();
  return {
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
    Authorization: `Bearer ${token}`
  };
}

/** @param {string} path @param {ApiOptions} [options] */
export async function api(path, { fetch: fetchFn = fetch, ...options } = {}) {
  const headers = await authenticatedHeaders(options.headers);
  const res = await fetchFn(`${PUBLIC_API_URL}/api/v1${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status} on ${path}`);
  }

  let ret = await res.json() ;
  //console.log(`API response for ${path}:`, ret);
  return ret;
}

/** @param {string} path @param {ApiOptions} [options] */
export async function apiWithStatus(path, { fetch: fetchFn = fetch, ...options } = {}) {
  const headers = await authenticatedHeaders(options.headers);
  const res = await fetchFn(`${PUBLIC_API_URL}/api/v1${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await res.json().catch(() => null);   // body may be empty

  return {status: res.status, data };
}

/** @param {string} path @param {FormData} formData @param {{ fetch?: typeof fetch }} [options] */
export async function apiUpload(path, formData, { fetch: fetchFn = fetch } = {}) {
  const headers = await authenticatedHeaders({}, false);
  const res = await fetchFn(`${PUBLIC_API_URL}/api/v1${path}`, {
    method: 'POST',
    headers,
    body: formData
  });
  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}

/** @param {string | null | undefined} fileUrl */
export function fileHref(fileUrl) {
  if (!fileUrl) return null;
  if (/^https?:\/\//i.test(fileUrl)) return fileUrl;          // already absolute
  const path = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
  return `${PUBLIC_API_URL}${path}`;
}