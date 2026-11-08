// src/routes/groups/[id]/firmware/+page.js
import { getFirmwares } from '$lib/apis/groups.js';

export async function load({ params, fetch }) {
  const firmwares = await getFirmwares(params.id, fetch);
  return { firmwares, groupId: params.id };
}