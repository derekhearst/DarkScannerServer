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
				'User-Agent': 'DarkScanner',
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		})
		const githubUser: GitHubUser = await githubUserResponse.json()
		console.log(githubUser)
		const isAdmin = githubUser.email == 'derekallenhearst@gmail.com'
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
			if (githubUser.email == 'derekallenhearst@gmail.com') {
				await locals.db.user.update({
					where: {
						id: existingUser.id,
					},
					data: {
						isAdmin: true,
					},
				})
			}
			return new Response(null, {
				status: 302,
				headers: {
					Location: '/',
					'Set-Cookie': sessionCookie.serialize(),
				},
			})
		} else {
			const userId = generateId(15)

			await locals.db.user.create({
				data: {
					id: userId,
					githubId: githubUser.id,
					isAdmin,
				},
			})

			const session = await locals.lucia.createSession(userId, {})
			const sessionCookie = locals.lucia.createSessionCookie(session.id)
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			})
			return new Response(null, {
				status: 302,
				headers: {
					Location: '/',
					'Set-Cookie': sessionCookie.serialize(),
				},
			})
		}
	} catch (e) {
		// the specific error message depends on the provider
		console.error(JSON.stringify(e))
		if (e instanceof OAuth2RequestError) {
			// invalid code
			error(400, 'Bad Request')
		}
		error(500, 'Internal Server Error')
	}
}

interface GitHubUser {
	id: number
	email: string
	login: string
}
