import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	/* TODO based on new schema
	 **
	 **
	 */
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e: unknown) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
