<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { initializeAuth } from '$lib/auth.js';

	let error = $state('');
    console.log("Callback page loaded, initializing auth...") ;
	onMount(async () => {
		const client = await initializeAuth();
		if (client) {
            console.log("Redirecting to /groups after successful sign-in") ;
			await goto('/groups');
            
		} else {
			error = 'Sign-in could not be completed. Return to the app and try again.';
		}
	});
</script>

<main class="min-h-screen grid place-items-center bg-gray-50 text-gray-600">
	<p>{error || 'Completing sign in...'}</p>
</main>