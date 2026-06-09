import Razorpay from "razorpay";
import crypto from "crypto";
import { ENV } from "../config/env.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { sendOrderConfirmationEmail } from "../config/email.js";
import { sendOrderConfirmationSMS } from "../config/sms.js";

const razorpay = new Razorpay({
  key_id: ENV.RAZORPAY_KEY_ID,
  key_secret: ENV.RAZORPAY_KEY_SECRET,
});

export async function createPaymentIntent(req, res) {
  try {
    const { cartItems, shippingAddress } = req.body;
    const user = req.user;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      subtotal += product.price * item.quantity;
      validatedItems.push({
        product: product._id.toString(),
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0],
      });
    }

    const shipping = 20;
    const tax = 0;
    const total = subtotal + shipping + tax;

    const order = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      notes: {
        userId: user._id.toString(),
        clerkId: user.clerkId,
        orderItems: JSON.stringify(validatedItems),
        shippingAddress: JSON.stringify(shippingAddress),
        totalPrice: total.toFixed(2),
        userEmail: user.email,
        userName: user.name,
      },
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: ENV.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create payment order" });
  }
}

export async function handleWebhook(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", ENV.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
    const { userId, clerkId, orderItems, shippingAddress, totalPrice, userEmail, userName } = razorpayOrder.notes;

    const existingOrder = await Order.findOne({ "paymentResult.id": razorpay_payment_id });
    if (existingOrder) {
      return res.json({ success: true });
    }

    const order = await Order.create({
      user: userId,
      clerkId,
      orderItems: JSON.parse(orderItems),
      shippingAddress: JSON.parse(shippingAddress),
      paymentResult: {
        id: razorpay_payment_id,
        status: "succeeded",
      },
      totalPrice: parseFloat(totalPrice),
    });

    const items = JSON.parse(orderItems);
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Email bhejo
    try {
      if (userEmail) {
        await sendOrderConfirmationEmail(order, userEmail, userName || "Customer");
      }
    } catch (emailErr) {
      console.error("Email error:", emailErr);
    }

    // SMS bhejo
    try {
      if (order.shippingAddress?.phoneNumber) {
        await sendOrderConfirmationSMS(
          order.shippingAddress.phoneNumber,
          order._id,
          order.paymentResult.status
        );
      }
    } catch (smsErr) {
      console.error("SMS error:", smsErr);
    }

    console.log("✅ Order created:", order._id);
    res.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}

export async function createCodOrder(req, res) {
  try {
    const { cartItems, shippingAddress } = req.body;
    const user = req.user;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      subtotal += product.price * item.quantity;
      validatedItems.push({
        product: product._id.toString(),
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0],
      });
    }

    const shipping = 20;
    const tax = 0;
    const total = subtotal + shipping + tax;

    const order = await Order.create({
      user: user._id,
      clerkId: user.clerkId,
      orderItems: validatedItems,
      shippingAddress,
      paymentResult: {
        id: `COD-${Date.now()}`,
        status: "cod_pending",
      },
      totalPrice: total,
    });

    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Email bhejo
    try {
      await sendOrderConfirmationEmail(order, user.email, user.name || "Customer");
    } catch (emailErr) {
      console.error("Email error:", emailErr);
    }

    // SMS bhejo
    try {
      await sendOrderConfirmationSMS(
        shippingAddress.phoneNumber,
        order._id,
        "cod_pending"
      );
    } catch (smsErr) {
      console.error("SMS error:", smsErr);
    }

    console.log("✅ COD Order created:", order._id);
    res.status(200).json({ success: true, orderId: order._id });
  } catch (error) {
    console.error("COD order error:", error);
    res.status(500).json({ error: "Failed to place COD order" });
  }
}