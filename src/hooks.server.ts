import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'
import { Lucia } from 'lucia'
import { env } from '$env/dynamic/private'
import { dev } from '$app/environment'
import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import { error } from '@sveltejs/kit'

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
		}
		// @ts-expect-error - user is't being typed correctly
		event.locals.user = user
	}
	// #endregion

	// #region Tokens
	const secureUrls = ['/api/enchantment', '/api/item', '/api/rarity', '/api/fix', '/api/failure']
	if (secureUrls.includes(event.url.pathname)) {
		const token = event.request.headers.get('Authorization')
		if (!token) {
			error(401, 'Unauthorized')
		}
		const [basic, tokenValue] = token.split(' ')
		if (basic !== 'Basic') {
			error(401, 'Unauthorized')
		}
		const existingToken = await prisma.token.findFirst({
			where: {
				key: tokenValue,
			},
		})
		if (!existingToken) {
			error(401, 'Unauthorized')
		}
		await event.locals.db.request.create({
			data: {
				tokenId: existingToken.id,
				params: event.request.url,
			},
		})
		event.locals.token = existingToken
	}

	// #endregion
	return resolve(event)
}
