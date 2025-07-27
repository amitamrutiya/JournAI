import express from "express";
import dotenv from "dotenv";
import { configureMiddleware } from "./middleware";
import { configureRoutes } from "./routes";
import { log } from "./utils/logger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
configureMiddleware(app);
configureRoutes(app);

app.listen(PORT, () => {
  log.info(`Server started successfully on port ${PORT}`);
});
