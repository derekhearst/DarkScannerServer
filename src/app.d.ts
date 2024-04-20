// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { PrismaClient } from '@prisma/client'
import type { Lucia, User } from 'lucia'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: PrismaClient
			lucia: Lucia
			user: User | undefined
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env?: {
				DB: D1Namespace
			}
		}
	}
}

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: DatabaseUserAttributes
	}
}

interface DatabaseUserAttributes {
	id: number
	githubId: string
	isAdmin: boolean
}

export {}
