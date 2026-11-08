<!-- src/routes/groups/[id]/firmware/+page.svelte -->
<script>
  import { invalidateAll } from '$app/navigation';
  import NavBar2 from '$lib/NavBar2.svelte';
  import { fileHref } from '$lib/apis/api.js';
  import { deleteFirmware } from '$lib/apis/groups.js';

  let { data } = $props();

  let error = $state('');
  let deletingId = $state(null);

  async function handleDelete(fw) {
   // if (!confirm(`Delete firmware version ${fw.version}?`)) return;

    deletingId = fw._id;
    error = '';
    try {
      const { status , ok,  } = await deleteFirmware(data.groupId, fw._id);

      console.log("deleteFirmware status: ", status) ;
      console.log("deleteFirmware ok: ", ok) ;
      if (status === 200) {
        await invalidateAll();   // re-run load so the list refreshes
      } else {
        error = `Could not delete (${status})`;
      }
    } catch {
      error = 'Cannot reach the server';
    } finally {
      deletingId = null;
    }
  }
</script>

<NavBar2 />

<main class="pt-20 px-4 md:px-6 bg-gray-50 min-h-screen space-y-6">
  <div class="max-w-3xl mx-auto bg-white border border-green-200 rounded-lg shadow-sm p-6">
    <h1 class="text-2xl font-semibold">Firmware images</h1>
    <a href="/groups/{data.groupId}" class="text-sm text-green-700 hover:underline">
      ← Back to group
    </a>
  </div>

  {#if error}
    <p class="max-w-3xl mx-auto text-sm text-red-600">{error}</p>
  {/if}

  <div class="max-w-3xl mx-auto space-y-4">
    {#each data.firmwares as fw (fw._id)}
      <div class="flex items-center justify-between bg-white border border-green-200 rounded-lg shadow-sm p-4">
        <div>
          <p class="font-semibold">Version {fw.version}</p>
          <p class="text-xs text-gray-500 font-mono">{fw._id}</p>
          {#if fw.fileUrl}
                <a
                href={fileHref(fw.fileUrl)}
                target="_blank"
                rel="noopener noreferrer"
                download
                class="mt-1 inline-block max-w-full truncate text-sm text-green-700 hover:underline"
                >
                {fw.fileUrl.split('/').pop()}
                </a>
            {:else}
                <p class="text-sm text-gray-400">No file</p>
            {/if}
        </div>

        <button
          onclick={() => handleDelete(fw)}
          disabled={deletingId === fw._id}
          aria-label="Delete firmware {fw.version}"
          title="Delete"
          class="p-2 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    {:else}
      <p class="text-gray-500 text-center">No firmware uploaded for this group yet.</p>
    {/each}
  </div>
</main>