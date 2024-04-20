import { error } from '@sveltejs/kit'

export async function POST({ locals, request }) {
	const text = await request.text()
	await locals.db.failure.create({
		data: {
			tokenId: locals.token.id,
			text,
		},
	})
	return new Response(null)
}
