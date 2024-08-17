import foodModel from "../models/foodModel.js";
import fs from "fs";

//add food item

const addFood = async (req, res) => {
  //logic for adding food
  //store the name of the image

  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  try {
    await food.save();
    res.json({
      success: true,
      message: "Food Added Successfully!",
    });

    console.log(image_filename);
  } catch (error) {
    // () => {
    console.log(error);
    res.json({ success: false, message: `Error->${error}` });
    // };
  }
};

// list food

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods, message: "Food displayed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: `Error->${error}` });
  }
};

//remove food item

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.body.id);
    console.log(food);
    res.json({
      success: true,
      message: "Food removed successfully",
      data: food,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: `error->${Error}` });
  }
};

export { addFood, listFood, removeFood };
