<script>
    
    import NavBar from '$lib/Navbar.svelte';
    import NavBar2 from '$lib/NavBar2.svelte';
</script>

<NavBar2 />
            
<main class="pt-20 px-4 md:px-6 bg-gray-50 min-h-screen space-y-6">
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

    <!-- Groups Card -->
    <a
        href="/groups"
        class="block bg-white border border-green-200 rounded-lg shadow-sm p-6 transform transition duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
    >
        <h2 class="text-lg font-medium mb-2">Groups</h2>
        <p class="text-sm text-gray-600 mb-4">
        Organize your devices into logical groups.
        </p>

        <ul class="text-sm space-y-2">
        <li class="flex justify-between">
            <span>Factory Sensors</span>
            <span class="text-gray-400">3 devices</span>
        </li>
        <li class="flex justify-between">
            <span>Office Devices</span>
            <span class="text-gray-400">5 devices</span>
        </li>
        </ul>
    </a>

    <!-- Devices Card -->
    <a
        href="/devices"
        class="block bg-white border border-green-200 rounded-lg shadow-sm p-6 transform transition duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
    >
        <h2 class="text-lg font-medium mb-2">Devices</h2>
        <p class="text-sm text-gray-600 mb-4">
        Overview of registered devices.
        </p>

        <ul class="text-sm space-y-2">
        <li class="flex justify-between">
            <span>Sensor A</span>
            <span class="text-green-600">Online</span>
        </li>
        <li class="flex justify-between">
            <span>Sensor B</span>
            <span class="text-red-600">Offline</span>
        </li>
        </ul>
    </a>

    </div>

  <slot />
</main>
