import express from "express";
import {
  addFood,
  listFood,
  removeFood,
} from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

//middleware -> upload
const upload = multer({
  storage: storage,
});

//for adding food
foodRouter.post("/add", upload.single("image"), addFood);

//for getting food
foodRouter.get("/list", listFood);

//for removing food
foodRouter.post("/remove", removeFood);
export default foodRouter;
