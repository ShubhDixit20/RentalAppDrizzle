"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookings = exports.vehicles = exports.vehicletypes = exports.users = void 0;
require("dotenv/config");
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    age: (0, pg_core_1.varchar)({ length: 3 }).notNull(),
    email: (0, pg_core_1.varchar)({ length: 255 }).unique()
});
exports.vehicletypes = (0, pg_core_1.pgTable)('vehicleType', {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.varchar)({ length: 255 }).notNull().unique(),
});
exports.vehicles = (0, pg_core_1.pgTable)('vehicles', {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    vehicle_type_id: (0, pg_core_1.integer)().references(() => exports.vehicletypes.id),
});
exports.bookings = (0, pg_core_1.pgTable)('bookings', {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    userId: (0, pg_core_1.integer)().notNull().references(() => exports.users.id),
    vehicleId: (0, pg_core_1.integer)().notNull().references(() => exports.vehicles.id),
    startDate: (0, pg_core_1.date)().notNull(),
    endDate: (0, pg_core_1.date)().notNull(),
});
