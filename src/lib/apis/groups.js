// src/lib/api/devices.js
import { api, apiWithStatus } from '$lib/apis/api.js';
import { apiUpload } from '$lib/apis/api.js';

export const getGroup = (groupId, fetch) =>{
    //console.log(`/group/${groupId}/devices`);
  return api(`/group/${groupId}`, { fetch });
}

/** @param {{ name: string, description?: string }} body */
export const createGroup = (body) =>
  apiWithStatus('/group', { method: 'POST', body });


export const uploadFirmware = (groupId, version, file) => {
  const formData = new FormData();
  formData.append('version', version);
  formData.append('GroupId', groupId);
  formData.append('firmware', file);   // append the file last
  return apiUpload('/firmware', formData);   // adjust to your real route
};


export const getFirmwares = (groupId, fetch) =>
  api(`/firmware/group/${groupId}`, { fetch });   // adjust to your real backend route

export const deleteFirmware = (groupId, firmwareId) =>
  apiWithStatus(`/firmware/${firmwareId}`, { method: 'DELETE' });