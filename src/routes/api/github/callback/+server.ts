import { OAuth2RequestError } from 'arctic'
import { generateId } from 'lucia'
import { github } from '$lib/server/auth'
import { error, redirect } from '@sveltejs/kit'

export async function GET({ locals, url, cookies }): Promise<Response> {
	const code = url.searchParams.get('code')
	const state = url.searchParams.get('state')
	const storedState = cookies.get('github_oauth_state') ?? null

	if (!code || !state || !storedState || state !== storedState) {
		error(400, 'Bad Request')
	}

	try {
		const tokens = await github.validateAuthorizationCode(code)
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		})
		const githubText = await githubUserResponse.clone().text()
		console.log(githubText)
		const githubUser: GitHubUser = await githubUserResponse.json()

		// Replace this with your own DB client.
		const existingUser = await locals.db.user.findFirst({
			where: {
				githubId: githubUser.id,
			},
		})

		if (existingUser) {
			const session = await locals.lucia.createSession(existingUser.id, {})
			const sessionCookie = locals.lucia.createSessionCookie(session.id)
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			})
		} else {
			const userId = generateId(15)

			await locals.db.user.create({
				data: {
					id: userId,
					githubId: githubUser.id,
				},
			})

			const session = await locals.lucia.createSession(userId, {})
			const sessionCookie = locals.lucia.createSessionCookie(session.id)
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			})
		}
		redirect(302, '/')
	} catch (e) {
		// the specific error message depends on the provider
		console.error(e)
		if (e instanceof OAuth2RequestError) {
			// invalid code
			error(400, 'Bad Request' + e.message)
		}
		error(500, 'Internal Server Error' + e.message)
	}
}

interface GitHubUser {
	id: number
	login: string
}
