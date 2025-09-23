import express, { Request, Response } from "express";
import db from "./db/db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

const app = express();
const PORT = 3000;

app.post("/", async (req: Request, res: Response) => {
  const user: typeof users.$inferInsert = {
    name: 'Jennifer',
    age: '30',
    email: 'jennifer@test.com',
  }

  await db.insert(users).values(user);
  console.log('New user created!');

  const select_user = await db.select().from(users);
  console.log(`Getting all users: ${select_user}`);

  return select_user;
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


