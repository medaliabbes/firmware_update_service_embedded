<script>
    import NavBar2 from '$lib/NavBar2.svelte';
    import GroupCard from '$lib/GroupCard.svelte';
    import { createGroup } from '$lib/apis/groups.js';
    import { invalidateAll } from '$app/navigation';
    let GroupName = $state('');
    let GroupDescription = $state('');

    let showCreateGroupModal = $state(false);
    function openCreateGroupModal() {
        showCreateGroupModal = true;
        console.log("Opening Create Group Modal");
    }

    function closeCreateGroupModal() {
        showCreateGroupModal = false;
        console.log("Closing Create Group Modal");
    }

    async function getNewGroupData(){
        
        GroupName = GroupName.trim()  ;
        GroupDescription = GroupDescription.trim() ;

        let response = await createGroup({ name: GroupName, description: GroupDescription }) ;

        if (response.status === 201) {
            ///console.log("Group created successfully");
            await invalidateAll();
            closeCreateGroupModal();
            // Optionally, you can refresh the list of groups here
        } else {
            console.error("Failed to create group:", response.status);
        }
    
        //console.log("GroupName " , GroupName ) ;
        //console.log("GroupDescription " , GroupDescription ) ;
    }

    let { data } = $props();   // Svelte 4: export let data;
    
</script>

<NavBar2 />

<main class="pt-20 px-4 md:px-6 bg-gray-50 min-h-screen space-y-6">
    <!-- Page Header Card -->
    <div class="max-w-3xl mx-auto bg-white border border-green-200 rounded-lg shadow-sm p-6 text-center">
        <h1 class="text-2xl font-semibold mb-2">Groups</h1>
        <p class="text-gray-600 text-sm">
            Organize your devices into logical groups.
        </p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    {#each data.groups as group }
        <a href={`/groups/${group._id}`} data-sveltekit-preload-data="tap" >
            <GroupCard title={group.name}  description={group.description} id = {group._id} />
        </a>
     {/each}

     
     </div>
    <!-- Groups List -->
    
    <div class="max-w-3xl mx-auto bg-white border border-green-200 rounded-lg shadow-sm p-6">

        <button
            on:click={openCreateGroupModal} 
            class="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition w-full"
        >
            Create Group
        </button>
    </div>

  {#if showCreateGroupModal == true}
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black/20 flex items-center justify-center z-50">

            <!-- Modal -->
            <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 class="text-xl font-semibold mb-4">
                    Create New Group
                </h2>

                <!-- Form -->
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Group Name
                        </label>
                        <input
                            type="text"
                            bind:value={GroupName}
                            placeholder="e.g. Factory Sensors"
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
                            bind:value={GroupDescription}
                            placeholder="Short description of the group"
                            class="w-full border border-gray-300 rounded px-3 py-2
                                focus:outline-none focus:ring-2 focus:ring-green-500"
                        ></textarea>
                    </div>
                </div>

                <!-- Actions -->
                <div class="mt-6 flex justify-end gap-3">
                    <button
                        on:click={closeCreateGroupModal}
                        class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button 
                        on:click={getNewGroupData}
                        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Create
                    </button>
                </div>
            </div>
     </div>
{/if}


</main>
