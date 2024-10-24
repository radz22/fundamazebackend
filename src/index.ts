import express, { Application } from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./db/databaseConnection";
import userRoutes from "./routes/userRoute";
import levelRoutes from "./routes/levelRoute";
import leaderBoardRoutes from "./routes/leaderBoardRoute";
import bodyParser from "body-parser";

const app: Application = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/api/users", userRoutes);
app.use("/api/level", levelRoutes);
app.use("/api/leadeboard", leaderBoardRoutes);

// Connect to database and start server
const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
