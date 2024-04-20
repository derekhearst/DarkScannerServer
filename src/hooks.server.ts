import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'
export const handle = async ({ event, resolve }) => {
	const adapter = new PrismaD1(event.platform?.env?.DB)
	const prisma = new PrismaClient({ adapter })
	event.locals.db = prisma
	// if (response.status === 404) {
	// 	response = new Response(response.body, { status: 404 });
	// }

	return resolve(event)
}
