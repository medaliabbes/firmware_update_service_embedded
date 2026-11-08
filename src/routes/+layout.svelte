<script>
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { authState, initializeAuth, login, signUp } from '$lib/auth.js';
	import NavBar2 from '$lib/NavBar2.svelte';

	let { children } = $props();
	onMount(() => {
		void initializeAuth();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{#if $authState.isLoading}
	<main class="min-h-screen grid place-items-center bg-gray-50 text-gray-600">
		<p>Checking your session...</p>
	</main>
{:else if $authState.error}
	<main class="min-h-screen grid place-items-center bg-gray-50 px-6">
		<section class="w-full max-w-lg border-l-4 border-amber-500 bg-white p-6 shadow-sm">
			<h1 class="text-xl font-semibold text-gray-900">Auth0 configuration required</h1>
			<p class="mt-3 text-sm text-gray-700">{$authState.error}</p>
		</section>
	</main>
{:else if !$authState.isAuthenticated}
	<NavBar2 />
	<main class="min-h-screen grid place-items-center bg-gray-50 px-6">
		<section class="w-full max-w-md  border-green-500 bg-white p-8 shadow-sm">
			<p class="text-sm font-semibold uppercase text-green-500">FUaaS</p>
			<h1 class="mt-3 text-2xl font-semibold text-gray-900">Sign in to your workspace</h1>
			<p class="mt-2 text-sm text-gray-600">Use your Auth0 account to manage groups, devices, and firmware.</p>
			<div class="mt-6 flex w-full flex-col gap-3">
				<button class="w-full bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600" onclick={login}>
					Sign in
				</button>
				<button class="w-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onclick={signUp}>
					Create account
				</button>
			</div>
			<footer class="mt-6 border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
				Firmware Update as a Service
			</footer>
		</section>
	</main>
{:else}
	{@render children()}
{/if}

