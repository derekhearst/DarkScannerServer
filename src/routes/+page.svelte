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
