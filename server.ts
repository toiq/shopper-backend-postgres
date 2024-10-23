import "module-alias/register";
import express, { Express } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import errorMiddleware from "./middlewares/errorMiddleware";

// Initialize express app
const app: Express = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/api", rootRouter);

// Error middleware (Important! Remember after route)
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
