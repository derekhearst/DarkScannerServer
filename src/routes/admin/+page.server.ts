import { error } from '@sveltejs/kit'

export async function load({ locals }) {
	if (!locals.user || !locals.user.isAdmin) {
		error(401, 'Forbidden')
	}

	const allFailures = locals.db.failure.findMany()
	const allTokens = locals.db.token.findMany()
	const allRequests = locals.db.request.findMany()

	return {
		allFailures: await allFailures,
		allTokens: await allTokens,
		allRequests: await allRequests,
	}
}

export const actions = {
	async addFix({ request, locals }) {
		const form = await request.formData()
		const data = {
			from: form.get('from') as string,
			to: form.get('to') as string,
		}
		const fix = await locals.db.fix.create({ data })
		return fix
	},
	async addItem({ request, locals }) {
		const form = await request.formData()
		const data = {
			name: form.get('name') as string,
		}
		const item = await locals.db.item.create({ data })
		return item
	},
	async revokeToken({ request, locals }) {
		const form = await request.formData()
		const key = form.get('key') as string

		const token = await locals.db.token.findFirst({ where: { key } })
		if (!token) error(404, 'Token not found')
		await locals.db.token.update({
			where: { id: token.id },
			data: { isRevoked: true },
		})
		return { success: true }
	},
}
