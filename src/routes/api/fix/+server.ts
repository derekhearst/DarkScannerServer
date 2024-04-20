import { json } from '@sveltejs/kit'

export async function GET({ locals }) {
	const { db } = locals
	const fixes = await db.fixes.findMany()
	return json(fixes)
}
