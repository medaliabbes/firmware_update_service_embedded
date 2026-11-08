// src/routes/groups/+page.js
import { api } from '$lib/apis/api.js';

export async function load({ fetch }) {
  const groups = await api('/group', { fetch });
  return { groups };
}