<script lang="ts">
	export let data
</script>

<details>
	<summary>Items</summary>
	<div>Count {data.items.length}</div>
	{#each data.items as item}
		<div>
			{item.name}
		</div>
	{/each}
</details>

<details>
	<summary>Enchantments</summary>
	<div>Count {data.allEnchantments.length}</div>
	{#each data.allEnchantments as enchantment}
		<div>
			{enchantment.name}
		</div>
	{/each}
</details>

<details>
	<summary>Rarities</summary>
	<div>Count {data.allRarities.length}</div>
	{#each data.allRarities as rarity}
		<div>
			{rarity.name}
		</div>
	{/each}
</details>

<details>
	<summary>Prices</summary>
	<div>Count {data.allPrices.length}</div>
	{#each data.allPrices as price}
		{@const item = data.items.find((item) => item.id === price.itemId)}
		{@const rarity = data.allRarities.find((rarity) => rarity.id === price.rarityId)}

		<div>
			{rarity?.name} - {item?.name} : {price.price}
		</div>
	{/each}
</details>

<details>
	<summary>Failures</summary>
	<div>Count {data.allFailures.length}</div>
	{#each data.allFailures as failure}
		{@const token = data.allTokens.find((token) => token.id === failure.tokenId)}
		<div>
			{token?.key} : {failure.text}
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
