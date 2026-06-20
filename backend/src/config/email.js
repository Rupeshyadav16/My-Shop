import { Resend } from "resend";
import { ENV } from "./env.js";

const resend = new Resend(ENV.RESEND_API_KEY);

export const sendOrderConfirmationEmail = async (order, userEmail, userName) => {
  try {
    const itemsList = order.orderItems
      .map((item) => `<tr>
        <td style="padding:8px;border-bottom:1px solid #333;">${item.name}</td>
        <td style="padding:8px;border-bottom:1px solid #333;text-align:center;">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #333;text-align:right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`)
      .join("");

    const isCOD = order.paymentResult?.id?.startsWith("COD-");

    await resend.emails.send({
      from: "My Shop <onboarding@resend.dev>",
      to: userEmail,
      subject: `✅ Order Confirmed #${order._id.toString().slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#1a1a1a;color:#fff;padding:30px;border-radius:12px;">
          <h1 style="color:#1DB954;text-align:center;">🛍️ Order Confirmed!</h1>
          <p style="color:#ccc;">Hi <strong>${userName}</strong>, your order has been placed successfully!</p>
          
          <div style="background:#2a2a2a;padding:20px;border-radius:8px;margin:20px 0;">
            <h3 style="color:#1DB954;">Order Details</h3>
            <p style="color:#ccc;">Order ID: <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong></p>
            <p style="color:#ccc;">Payment: <strong style="color:${isCOD ? "#FFA500" : "#1DB954"}">${isCOD ? "Cash on Delivery" : "Online Payment"}</strong></p>
          </div>

          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#2a2a2a;">
                <th style="padding:8px;text-align:left;color:#1DB954;">Product</th>
                <th style="padding:8px;text-align:center;color:#1DB954;">Qty</th>
                <th style="padding:8px;text-align:right;color:#1DB954;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsList}</tbody>
          </table>

          <div style="text-align:right;margin-top:15px;padding-top:15px;border-top:1px solid #333;">
            <p style="color:#1DB954;font-size:20px;font-weight:bold;">Total: ₹${order.totalPrice.toFixed(2)}</p>
          </div>

          <div style="background:#2a2a2a;padding:15px;border-radius:8px;margin-top:20px;">
            <h3 style="color:#1DB954;">📍 Delivery Address</h3>
            <p style="color:#ccc;margin:0;">${order.shippingAddress.fullName}</p>
            <p style="color:#ccc;margin:0;">${order.shippingAddress.streetAddress}</p>
            <p style="color:#ccc;margin:0;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
            <p style="color:#ccc;margin:0;">📞 ${order.shippingAddress.phoneNumber}</p>
          </div>

          <p style="color:#666;text-align:center;margin-top:30px;font-size:12px;">Thank you for shopping with us! 🙏</p>
        </div>
      `,
    });

    console.log("✅ Order confirmation email sent to:", userEmail);
  } catch (error) {
    console.error("❌ Email error:", error);
  }
};

export const sendOrderStatusEmail = async (order, userEmail, userName, newStatus) => {
  try {
    const statusMessages = {
      processing: { emoji: "⚙️", title: "Order is Being Processed", msg: "We are preparing your order." },
      confirmed: { emoji: "✅", title: "Order Confirmed", msg: "Your order has been confirmed." },
      packed: { emoji: "📦", title: "Order Packed", msg: "Your order is packed and ready for pickup." },
      shipped: { emoji: "🚚", title: "Order Shipped!", msg: "Your order is on the way!" },
      delivered: { emoji: "✅", title: "Order Delivered!", msg: "Your order has been delivered. Enjoy!" },
      cancelled: { emoji: "❌", title: "Order Cancelled", msg: "Your order has been cancelled." },
    };

    const statusInfo = statusMessages[newStatus] || { emoji: "📦", title: "Order Update", msg: "Your order status has been updated." };

    await resend.emails.send({
      from: "My Shop <onboarding@resend.dev>",
      to: userEmail,
      subject: `${statusInfo.emoji} ${statusInfo.title} - Order #${order._id.toString().slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#1a1a1a;color:#fff;padding:30px;border-radius:12px;">
          <h1 style="color:#1DB954;text-align:center;">${statusInfo.emoji} ${statusInfo.title}</h1>
          <p style="color:#ccc;">Hi <strong>${userName}</strong>, ${statusInfo.msg}</p>
          
          <div style="background:#2a2a2a;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
            <p style="color:#ccc;">Order ID: <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong></p>
            <p style="color:#1DB954;font-size:24px;font-weight:bold;">${statusInfo.emoji} ${newStatus.toUpperCase()}</p>
          </div>

          <p style="color:#666;text-align:center;margin-top:30px;font-size:12px;">Thank you for shopping with us! 🙏</p>
        </div>
      `,
    });

    console.log("✅ Status update email sent:", newStatus, "to:", userEmail);
  } catch (error) {
    console.error("❌ Email error:", error);
  }
};