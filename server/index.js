import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import auth from "./routes/auth.js";
import tasks from "./routes/tasks.js";
import teams from "./routes/teams.js";
import users from "./routes/users.js";
import initGlobalTeam from "./utils/initGlobalTeam.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", auth);
app.use("/api/tasks", tasks);
app.use("/api/teams", teams);
app.use("/api/users", users);


mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("Connected to MongoDB");
    await initGlobalTeam();
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });


