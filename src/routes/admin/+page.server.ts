export async function load({ locals }) {
	const allFailures = locals.db.failure.findMany()
	const allTokens = locals.db.token.findMany()
	const allRequests = locals.db.request.findMany()

	return {
		allFailures: await allFailures,
		allTokens: await allTokens,
		allRequests: await allRequests,
	}
}
