<script>
  import { authState, logout } from '$lib/auth.js';
</script>

<nav class="w-full bg-white shadow-md py-4 px-6 fixed top-0 left-0 z-50 border-b-2 border-green-400">
  <div class="flex justify-between items-center gap-4">
    <h1 class="text-2xl font-bold text-green-500">Nexus</h1>

    <!-- Desktop Menu style class="hidden md:flex gap-6 text-lg font-medium" -->
    <div class="flex items-center gap-6 text-sm">
      {#if $authState.isAuthenticated}
        <a href="/" class="hover:text-green-400 transition">Dashboard</a>
        <a href="/groups" class="hover:text-green-400 transition">Groups</a>
        {#if $authState.user?.email}
          <span class="hidden md:inline text-gray-600">{$authState.user.email}</span>
        {/if}
        <button class="border border-gray-300 px-3 py-1.5 hover:bg-gray-50" onclick={logout}>
          Sign out
        </button>
      {/if}
    </div>
  </div>
</nav>
