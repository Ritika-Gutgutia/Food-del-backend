import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
dotenv.config();

//app config
const app = express();
const port = process.env.PORT || 4000;

//app middleware
app.use(express.json());
//whenever request from frontend to backend it will be pasrsed by json. check.
app.use(cors());

//db connection
connectDB();

//api endpoints
app.use("/api/food", foodRouter);
app.use("/uploads", express.static("uploads"));

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send({
    o: "api working",
  });
});

//run express server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

//mongodb+srv://gutgutiaritika:FoodDelivery@cluster0.ebofvqn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
