import { error, json } from '@sveltejs/kit'

export async function GET({ locals, request }) {
	const token = request.headers.get('token')
	if (!token) {
		error(401, 'Unauthorized')
	}
	const existingToken = await locals.db.token.findFirst({
		where: { key: token },
	})
	if (!existingToken) {
		error(401, 'Unauthorized')
	}
	const newRequest = await locals.db.request.create({
		data: {
			tokenId: existingToken.id,
			params: 'GET /api/fix',
		},
	})
	const { db } = locals
	const fixes = await db.fixes.findMany()
	return json(fixes)
}
