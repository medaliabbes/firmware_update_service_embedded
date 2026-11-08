// the same +page.js that returns `group`
import { getGroup } from '$lib/apis/groups.js';
import { getDevices } from '$lib/apis/devices.js';

export async function load({ params, fetch }) {
  //console.log('group id ' , params.id) ; 
  const group = await getGroup(params.id, fetch);
  const devices = await getDevices(params.id, fetch);
  return { group, devices };
}
