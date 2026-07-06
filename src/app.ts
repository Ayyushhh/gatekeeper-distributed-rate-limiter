import express from "express";
import rateLimitRoutes from "./routes/rate-limit.routes";

const app = express();

app.use(express.json());
app.use("/rate-limit", rateLimitRoutes);

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
  });
});

export default app;