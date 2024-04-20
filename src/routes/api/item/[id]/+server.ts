import { json } from '@sveltejs/kit'

export async function GET({ locals, params }) {
	const { db } = locals
	const itemId = parseInt(params.id)
	const item = await db.item.findUniqueOrThrow({ where: { id: itemId } })
	return json(item)
}
