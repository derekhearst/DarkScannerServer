import { json } from '@sveltejs/kit'

export async function GET({ locals, request }) {
	const { db } = locals
	const fixes = await db.fix.findMany()
	return json(fixes)
}
