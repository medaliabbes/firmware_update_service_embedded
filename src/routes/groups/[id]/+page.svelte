<script>
   
    import { invalidateAll } from '$app/navigation';
    import NavBar2 from '$lib/NavBar2.svelte';
    import DeviceCard from '$lib/DeviceCard.svelte';
    import { createDevice } from '$lib/apis/devices.js';
    import { uploadFirmware } from '$lib/apis/groups.js';

    let showCreateDeviceModal = $state(false);
    let DeviceName = $state('');
    let DeviceDescription = $state('');
    let DeviceUID = $state('');
    let error = $state('');

    let { data } = $props();

    let fileInput;                       // reference to the hidden input
    let uploading = $state(false);
    let message = $state('');
    
    function OpenDeviceModal(){
        showCreateDeviceModal = true ; 
    }

    function closeDeviceModal(){
        showCreateDeviceModal = false ; 
    }

    async function getNewDeviceData(){
        DeviceName = DeviceName.trim() ;
        DeviceDescription = DeviceDescription.trim() ;
        DeviceUID = DeviceUID.trim() ; 
        /*
        console.log("DeviceName :" , DeviceName) ;
        console.log("DeviceDescription :" , DeviceDescription) ;
        console.log("DeviceUID :" , DeviceUID) ;
        */

        const { status, data: device } = await createDevice( {GroupId : data.group._id, name: DeviceName ,
             description : DeviceDescription});

        if (status === 201) {
            await invalidateAll();
            closeDeviceModal() ;
        } else if (status === 400) {
            error = 'Invalid device data';
        } else {
            error = `Something went wrong (${status})`;
        }
    }

    async function onFileSelected(e) {
    const file = e.target.files[0];
    if (!file) return;

    uploading = true;
    message = '';
    try {
      const { ok, status } = await uploadFirmware(data.group._id,"v1.0.0" ,file) ; 
      message = ok ? 'Firmware uploaded' : `Upload failed (${status})`;
    } catch {
      message = 'Cannot reach the server';
    } finally {
      uploading = false;
      e.target.value = '';             // allow re-selecting the same file
    }
  }
 
</script>

<NavBar2 />

<main class="pt-20 px-4 md:px-6 bg-gray-50 min-h-screen">
  <div class="max-w-3xl mx-auto bg-white border border-green-200 rounded-lg shadow-sm p-6">
    <h1 class="text-2xl font-semibold mb-2">{data.group.name}</h1>

    {#if data.group.description}
      <p class="text-gray-700">{data.group.description}</p>
      
    {/if}
    <p class="mt-4 text-sm text-gray-500">
      Group ID: <span class="font-mono">{data.group._id }</span>
    </p>
    <div class="mt-4 flex flex-wrap gap-3">
        <input
            type="file"
            accept=".bin,.hex,.elf"
            class="hidden"
            bind:this={fileInput}
            onchange={onFileSelected}
        />
        <button
        onclick={() => fileInput.click()}
        disabled={uploading}
        class="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
            {uploading ? 'Uploading...' : 'Upload firmware image'}
        </button>
        <a
        href="/groups/{data.group._id}/firmware"
        class="px-4 py-2 border border-green-600 text-green-700 rounded hover:bg-green-50"
        >
            View firmware images
        </a>
    </div>
    {#if message}
        <p class="mt-2 text-sm text-gray-600">{message}</p>
    {/if}

  </div>

  <div class="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    {#each data.devices as device (device._id)}
        <DeviceCard id={device._id} name={device.name} description={device.description} />
    {/each}
  </div>

    <div class="max-w-3xl mx-auto bg-white border border-green-200 rounded-lg shadow-sm p-6 gap-6 ">

        <button
            onclick={OpenDeviceModal} 
            class="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition w-full"
        >
            Create Device
        </button>
    </div>

  {#if showCreateDeviceModal == true }
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black/20 flex items-center justify-center z-50">

            <!-- Modal -->
            <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 class="text-xl font-semibold mb-4">
                    Create New Device
                </h2>

                <!-- Form -->
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Device Name
                        </label>
                        <input
                            type="text"
                            bind:value={DeviceName}
                            placeholder="e.g. Factory Sensors"
                            class="w-full border border-gray-300 rounded px-3 py-2
                                focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Device UID
                        </label>
                        <input
                            type="text"
                            bind:value={DeviceUID}
                            placeholder="e.g. UID"
                            class="w-full border border-gray-300 rounded px-3 py-2
                                focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Description (optional)
                        </label>
                        <textarea
                            rows="3"
                            bind:value={DeviceDescription}
                            placeholder="Short description of the group"
                            class="w-full border border-gray-300 rounded px-3 py-2
                                focus:outline-none focus:ring-2 focus:ring-green-500"
                        ></textarea>
                    </div>
                </div>
                {#if error}
                    <p class="text-sm text-red-600">{error}</p>
                {/if}
                <!-- Actions -->
                <div class="mt-6 flex justify-end gap-3">
                    <button
                        onclick={closeDeviceModal}
                        class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button 
                        onclick={getNewDeviceData}
                        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Create
                    </button>
                </div>
            </div>
     </div>
  {/if}
</main>