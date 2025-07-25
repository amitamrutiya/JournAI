import express from "express";
import dotenv from "dotenv";
import {
  clerkMiddleware,
  requireAuth,
  getAuth,
  clerkClient,
} from "@clerk/express";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("Welcome to the JournAI server!");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


app.get("/protected", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const user = await clerkClient.users.getUser(userId);
  return res.json({ user });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
