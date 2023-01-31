import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

	// Create some Cats
	const muffinCat = await prisma.cat.create({
		data: { name: 'Muffin' }
	});

	const cupcakeCat = await prisma.cat.create({
		data: { name: 'Cupcake' }
	});

	// Create some Caretakers
	const dianeCaretaker = await prisma.caretaker.create({
		data: { name: 'Diane' }
	});

	const busterCaretaker = await prisma.caretaker.create({
		data: { name: 'Buster' }
	});

	// Create some FoodBrands
	const friskiesFoodBrand = await prisma.foodBrand.create({
		data: { name: 'Friskies' }
	});

	const craveFoodBrand = await prisma.foodBrand.create({
		data: { name: 'Crave' }
	});

	// Create some FoodUnits
	const canFoodUnit = await prisma.foodUnit.create({
		data: {
			name: 'Can',
			minFractionalAmount: 0.5
		}
	});

	const cupFoodUnit = await prisma.foodUnit.create({
		data: {
			name: 'Cup',
			minFractionalAmount: 0.25
		}
	});

	// Create some Foods
	const friskiesChickenShreds = await prisma.food.create({
		data: {
			name: "Friskies Chicken Shreds",
			brand: {
				connect: { id: friskiesFoodBrand.id }
			},
			unit: {
				connect: { id: canFoodUnit.id }
			},
			wetOrDry: 'Wet',
			form: 'Shreds',
			flavor: 'Chicken',
			unitsInStock: 72
		}
	});

	const friskiesWhitefishShreds = await prisma.food.create({
		data: {
			name: "Friskies Whitefish Shreds",
			brand: {
				connect: { id: friskiesFoodBrand.id }
			},
			unit: {
				connect: { id: canFoodUnit.id }
			},
			wetOrDry: 'Wet',
			form: 'Shreds',
			flavor: 'Whitefish',
			unitsInStock: 28
		}
	});

	const craveSalmonKibble = await prisma.food.create({
		data: {
			name: "Crave Salmon Kibble",
			brand: {
				connect: { id: craveFoodBrand.id }
			},
			unit: {
				connect: { id: cupFoodUnit.id }
			},
			wetOrDry: 'Dry',
			form: 'Kibble',
			flavor: 'Salmon',
			unitsInStock: 51.75
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