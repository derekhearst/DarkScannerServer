<script lang="ts">
	import { enhance } from '$app/forms'

	export let data
</script>

<details>
	<summary>Add Fix</summary>
	<form action="/admin?/addFix" method="POST" use:enhance>
		<input type="text" name="from" placeholder="From" />
		<input type="text" name="to" placeholder="to" />
		<button type="submit">Add Fix</button>
	</form>
</details>

<details>
	<summary>Add Item</summary>
	<form action="/admin?/addItem" method="POST" use:enhance>
		<input type="text" name="name" placeholder="Name" />
		<button type="submit">Add Item</button>
	</form>
</details>

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
			{token.id} - {token.key} - {token.isRevoked ? 'Revoked' : 'Active'}
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
