import express, { Request, Response } from "express";
import db from "./db/db";
import { users, bookings, vehicletypes, vehicles } from "./db/schema";
import { eq } from "drizzle-orm";
import cors from 'cors';

const app = express();

app.use(cors()); // Adding this later as I faced conflict while testing for my local website. Now, this will allow the cross-origins connection and API calls.

const PORT = 3000;

app.use(express.json());

// Vehicle-Types section.

// Get all vehicle types
app.get("/vehicle-types", async (req: Request, res: Response) => {
  try {
    const types = await db.select().from(vehicletypes);
    res.json(types);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching vehicle types" });
  }
});

// Bookings section.

// Create a new booking
app.post("/bookings", async (req: Request, res: Response) => {
  try {
    const { userId, vehicleId, startDate, endDate } = req.body;

    // basic validation
    if (!userId || !vehicleId || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking: typeof bookings.$inferInsert = {
      userId,
      vehicleId,
      startDate,
      endDate,
    };

    const result = await db.insert(bookings).values(booking).returning();

    res.status(201).json({ message: "Booking created successfully", booking: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating booking" });
  }
});

// Get all bookings
app.get("/bookings", async (req: Request, res: Response) => {
  try {
    const allBookings = await db.select().from(bookings);
    res.json(allBookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching bookings" });
  }
});

// Get booking by ID (of booking).
app.get("/bookings/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await db.select().from(bookings).where(eq(bookings.id, Number(id)));

    if (booking.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching booking" });
  }
});

// Get bookings by ID (of user).
app.get("/bookings/user/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userBookings = await db.select().from(bookings).where(eq(bookings.userId, Number(userId)));

    res.json(userBookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching user bookings" });
  }
});

app.get("/vehicles", async (req: Request, res: Response) => {
  try {
    const { vehicleTypeId } = req.query;

    if (!vehicleTypeId) {
      return res.status(400).json({ error: "vehicleTypeId is required" });
    }

    const vehicleList = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.vehicle_type_id, Number(vehicleTypeId)));

    res.json(vehicleList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
