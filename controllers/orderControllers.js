import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // creating an instance of Stripe Client

//placing user orders from frontend

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();
    //because the order is placed hence cartData will be an empty object
    await userModel.findByIdAndUpdate(req.body.userId, {
      cartData: {},
    });

    // creating payment link using stripe
    let deliveryCharge = 80;

    if (newOrder.amount === 0) {
      deliveryCharge = 0;
    }

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },

      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery charges",
        },
        unit_amount: deliveryCharge * 100,
      },

      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: "true", session_url: session.url });
  } catch (error) {
    res.json({
      success: "false",
      userMessage: "Unable to place an order",
    });
  }
};

const verifyOrder = async (req, res) => {
  try {
    const { success, orderId } = req.body();

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: "true", userMessage: "Paid successfully :)" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: "false", userMessage: "Payment failure :(" });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: "false",
      userMessage: "Error in verifying the payment",
    });
  }
};

const userOrders = async (req, res) => {
  try {
    // const userOrder = await orderModel.findById(req.body.userId);

    // if (!userOrder) {
    //   return res.json({
    //     userMessage: "No orders found",
    //   });
    // }

    // const orderItems = await userOrder.items;
    const orders = await orderModel.find({ userId: req.body.userId });
    res.send({
      success: "true",
      data: orders,
    });
  } catch (error) {
    console.log(error);

    res.json({
      succcess: "false",
      userMessage: `Error (${error}) in getting user orders `,
    });
  }
};

// listing orders for admin panel

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    if (orders.size > 0) {
      return res.send({
        success: "true",
        data: orders,
      });
    } else {
      return res.send({
        adminMessage: "No orders",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      success: "false",
      adminMessage: `Error in fetching orders (${error})`,
    });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders };
