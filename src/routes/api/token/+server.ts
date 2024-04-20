import { json } from '@sveltejs/kit'

export async function GET({ locals, getClientAddress }) {
	const newToken = await locals.db.token.create({
		data: {
			key: crypto.randomUUID(),
			ip: getClientAddress(),
		},
	})
	return json(newToken.key)
}
