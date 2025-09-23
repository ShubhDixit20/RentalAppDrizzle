import { error } from "console";
import db from "./db";
import { vehicletypes, vehicles } from "./schema";

async function seedValues() {
    const [hatchback, suv, sedan, cruiser, sports] = await db.insert(vehicletypes).values([
        { name: 'Hatchback' },
        { name: 'SUV' },
        { name: 'Sedan' },
        { name: 'Cruiser' },
        { name: 'Sports' },
    ]).returning();

    await db.insert(vehicles).values([
        { name: 'i20', vehicle_type_id: hatchback.id },
        { name: 'Endevour', vehicle_type_id: suv.id },
        { name: 'Mercedes', vehicle_type_id: sedan.id },
        { name: 'Harley Davidson', vehicle_type_id: cruiser.id },
        { name: 'Truimph', vehicle_type_id: sports.id }
    ])
}

seedValues()
    .then(() => {
        console.log("Seeding complete!");
        process.exit(0);
    })
    .catch((error) => {
        console.log("Seeding error!", error);
        process.exit(0);
    })

