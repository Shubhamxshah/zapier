import express from "express";
import cors from "cors";
import userRouter from "./router/user";
import zapRouter from "./router/zap";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", zapRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});