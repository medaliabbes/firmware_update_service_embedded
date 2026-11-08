<script>
  let { id, name, description = '' } = $props();
</script>

<div class="bg-white border border-green-200 rounded-lg shadow-sm p-4 hover:shadow-md transition">
  <h3 class="text-lg font-semibold text-gray-900">{name}</h3>

  {#if description}
    <p class="mt-1 text-sm text-gray-600">{description}</p>
  {/if}

  <p class="mt-3 text-xs text-gray-500">
    Device ID: <span class="font-mono">{id}</span>
  </p>
</div>