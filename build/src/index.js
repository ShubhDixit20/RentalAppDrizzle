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
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db/db"));
const schema_1 = require("./db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // Adding this later as I faced conflict while testing for my local website. Now, this will allow the cross-origins connection and API calls.
const PORT = 3000;
app.use(express_1.default.json());
// Vehicle-Types section.
// Get all vehicle types
app.get("/vehicle-types", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const types = yield db_1.default.select().from(schema_1.vehicletypes);
        res.json(types);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching vehicle types" });
    }
}));
// Bookings section.
// Create a new booking
app.post("/bookings", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, vehicleId, startDate, endDate } = req.body;
        // basic validation
        if (!userId || !vehicleId || !startDate || !endDate) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const booking = {
            userId,
            vehicleId,
            startDate,
            endDate,
        };
        const result = yield db_1.default.insert(schema_1.bookings).values(booking).returning();
        res.status(201).json({ message: "Booking created successfully", booking: result[0] });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating booking" });
    }
}));
// Get all bookings
app.get("/bookings", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allBookings = yield db_1.default.select().from(schema_1.bookings);
        res.json(allBookings);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching bookings" });
    }
}));
// Get booking by ID (of booking).
app.get("/bookings/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const booking = yield db_1.default.select().from(schema_1.bookings).where((0, drizzle_orm_1.eq)(schema_1.bookings.id, Number(id)));
        if (booking.length === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.json(booking[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching booking" });
    }
}));
// Get bookings by ID (of user).
app.get("/bookings/user/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const userBookings = yield db_1.default.select().from(schema_1.bookings).where((0, drizzle_orm_1.eq)(schema_1.bookings.userId, Number(userId)));
        res.json(userBookings);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching user bookings" });
    }
}));
// Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
