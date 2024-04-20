import { redirect } from '@sveltejs/kit'

export async function GET({ locals, cookies }) {
	const sessionCookie = locals.lucia.createBlankSessionCookie()
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes,
	})

	redirect(302, '/')
}
