"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
const schema_1 = require("./schema");
function seedValues() {
    return __awaiter(this, void 0, void 0, function* () {
        const [hatchback, suv, sedan, cruiser, sports] = yield db_1.default.insert(schema_1.vehicletypes).values([
            { name: 'Hatchback' },
            { name: 'SUV' },
            { name: 'Sedan' },
            { name: 'Cruiser' },
            { name: 'Sports' },
        ]).returning();
        yield db_1.default.insert(schema_1.vehicles).values([
            { name: 'i20', vehicle_type_id: hatchback.id },
            { name: 'Endevour', vehicle_type_id: suv.id },
            { name: 'Mercedes', vehicle_type_id: sedan.id },
            { name: 'Harley Davidson', vehicle_type_id: cruiser.id },
            { name: 'Truimph', vehicle_type_id: sports.id }
        ]);
    });
}
seedValues()
    .then(() => {
    console.log("Seeding complete!");
    process.exit(0);
})
    .catch((error) => {
    console.log("Seeding error!", error);
    process.exit(0);
});
