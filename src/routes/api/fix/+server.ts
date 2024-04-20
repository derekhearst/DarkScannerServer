import { error, json } from '@sveltejs/kit'

export async function GET({ locals, request }) {
	const { db } = locals
	const fixes = await db.fixes.findMany()
	return json(fixes)
}
