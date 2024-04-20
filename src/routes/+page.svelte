<script lang="ts">
	export let data
</script>

<details>
	<summary>Items</summary>
	<div>Count {data.items.length}</div>
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Price</th>
			</tr>
		</thead>
		<tbody>
			{#each data.items as item}
				<tr>
					<td>{item.name}</td>
					<td>
						{#each item.prices as price}
							<span>{price.rarity} - {price.price}</span>
						{/each}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
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
