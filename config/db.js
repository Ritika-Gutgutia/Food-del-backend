import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://gutgutiaritika:FoodDelivery@cluster0.ebofvqn.mongodb.net/food-del"
    )
    .then(() => console.log("DB Connected"));
};
