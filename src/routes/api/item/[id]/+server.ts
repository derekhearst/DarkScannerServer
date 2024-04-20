import { error, json } from '@sveltejs/kit'

export async function GET({ locals, params, request }) {
	const itemId = parseInt(params.id)
	if (isNaN(itemId)) {
		error(400, 'Invalid item ID')
	}
	const { db } = locals
	const item = await db.item.findUniqueOrThrow({ where: { id: itemId } })
	return json(item)
}
