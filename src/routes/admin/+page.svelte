<script lang="ts">
	export let data
</script>

<details>
	<summary>Failures</summary>
	<div>Count {data.allFailures.length}</div>
	{#each data.allFailures as failure}
		{@const token = data.allTokens.find((token) => token.id === failure.tokenId)}
		<div>
			{token?.id} : {failure.text}
		</div>
	{/each}
</details>

<details>
	<summary>Tokens</summary>
	<div>Count {data.allTokens.length}</div>
	{#each data.allTokens as token}
		<div>
			{token.createdAt.toLocaleString()}
		</div>
	{/each}
</details>

<details>
	<summary>Requests</summary>
	<div>Count {data.allRequests.length}</div>
	{#each data.allRequests as request}
		<div>
			{request.params}
		</div>
	{/each}
</details>
