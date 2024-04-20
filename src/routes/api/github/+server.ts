import { redirect } from '@sveltejs/kit'
import { generateState } from 'arctic'
import { github } from '$lib/server/auth'

import type { RequestEvent } from '@sveltejs/kit'

export async function GET(event: RequestEvent) {
	const state = generateState()
	const url = await github.createAuthorizationURL(state, {
		scopes: ['user:email'],
	})

	event.cookies.set('github_oauth_state', state, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax',
	})

	redirect(302, url.toString())
}
