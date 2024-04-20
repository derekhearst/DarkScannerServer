import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'
import { Lucia } from 'lucia'
import { env } from '$env/dynamic/private'
import { dev } from '$app/environment'
import { PrismaAdapter } from '@lucia-auth/adapter-prisma'

export const handle = async ({ event, resolve }) => {
	const adapter = new PrismaD1(event.platform?.env?.DB)
	const prisma = new PrismaClient({ adapter })
	event.locals.db = prisma

	// #region lucia
	const prismaAdapter = new PrismaAdapter(prisma.session, prisma.user)
	const lucia = new Lucia(prismaAdapter, {
		sessionCookie: {
			attributes: {
				secure: !dev,
			},
		},
		getUserAttributes: (attributes) => {
			return {
				id: attributes.id,
				githubId: attributes.githubId,
				isAdmin: attributes.isAdmin,
			}
		},
	})
	event.locals.lucia = lucia
	const sessionCookie = event.cookies.get(lucia.sessionCookieName)
	if (sessionCookie) {
		const { session, user } = await lucia.validateSession(sessionCookie)
		if (session && session.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id)
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			})
			event.locals.user = user
		}
	}
	console.log('event.locals.user', event.locals.user)
	// #endregion

	return resolve(event)
}
