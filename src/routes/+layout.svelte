<script lang="ts">
	import '../app.css'
	export let data
</script>

<header>
	{#if data.user}
		<a href="/api/github/logout">Sign out</a>
	{:else}
		<a href="/api/github">Sign in with GitHub</a>
	{/if}
</header>

<slot />
