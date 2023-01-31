import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	// Create a Species
	const cat = await prisma.species.create({
		data: {
			name: 'Cat'
		}
	});

	// Create some Pets
	await prisma.pet.create({
		data: {
			name: 'Muffin',
			species: { connect: { id: cat.id } }
		}
	});

	await prisma.pet.create({
		data: {
			name: 'Cupcake',
			species: { connect: { id: cat.id } }
		}
	});

	// Create some Foods
	await prisma.food.create({
		data: {
			name: 'Friskies Chicken Shreds',
			species: { connect: { id: cat.id } },
			unitType: 'Can',
			unitsInStock: 72,
			minFractionalAmount: 0.5
		}
	});

	await prisma.food.create({
		data: {
			name: 'Friskies Prime Filets Turkey Dinner in Gravy',
			species: { connect: { id: cat.id } },
			unitType: 'Can',
			unitsInStock: 28,
			minFractionalAmount: 0.5
		}
	});

	await prisma.food.create({
		data: {
			name: 'Crave High Protein Adult Salmon Dry Food',
			species: { connect: { id: cat.id } },
			unitType: 'Cup',
			unitsInStock: 51.75,
			minFractionalAmount: 0.25
		}
	});
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
