import 'dotenv/config';
import { integer, pgTable, varchar, date } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    age: varchar({ length: 3 }).notNull(),
    email: varchar({ length: 255 }).unique()
});

export const vehicletypes = pgTable('vehicleType', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull().unique(),
});

export const vehicles = pgTable('vehicles', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    vehicle_type_id: integer().references(() => vehicletypes.id),
});

export const bookings = pgTable('bookings', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().notNull().references(() => users.id),
    vehicleId: integer().notNull().references(() => vehicles.id),
    startDate: date().notNull(),
    endDate: date().notNull(),
});
