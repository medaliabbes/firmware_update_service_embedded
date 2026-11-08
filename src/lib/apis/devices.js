// src/lib/api/devices.js
import { api , apiWithStatus} from '$lib/apis/api.js';

export const getDevices = (groupId, fetch) =>{
    //console.log(`/group/${groupId}/devices`);
  return api(`/group/${groupId}/devices`, { fetch });
}


export const createDevice = (body) =>
  apiWithStatus(`/device`, { method: 'POST', body });