const FAST2SMS_KEY = "ZYx1nr3K5spqEz57OAhS6dorOf5rHh3ADxjdfBNaGh4fF5y4m5IsBSI3iu1M"; // apni key yahan daalo

export const sendSMS = async (phoneNumber, message) => {
  try {
    const cleanNumber = phoneNumber.replace(/^(\+91|91|0)/, "").trim();

    if (cleanNumber.length !== 10) {
      console.log("Invalid phone number:", phoneNumber);
      return;
    }

    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: FAST2SMS_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        message: message,
        language: "english",
        flash: 0,
        numbers: cleanNumber,
      }),
    });

    const data = await response.json();
    console.log("✅ SMS sent:", data);
    return data;
  } catch (error) {
    console.error("❌ SMS error:", error);
  }
};

export const sendOrderConfirmationSMS = async (phoneNumber, orderId, paymentMethod) => {
  const orderRef = orderId.toString().slice(-8).toUpperCase();
  const paymentText = paymentMethod === "cod_pending" ? "Cash on Delivery" : "Online Payment";
  const message = `Your order #${orderRef} has been confirmed! Payment: ${paymentText}. Expected delivery: 3-5 business days. Thank you for shopping with us!`;
  await sendSMS(phoneNumber, message);
};

export const sendOrderStatusSMS = async (phoneNumber, orderId, status) => {
  const orderRef = orderId.toString().slice(-8).toUpperCase();

  const messages = {
    confirmed: `Order #${orderRef} confirmed! We will start processing it soon.`,
    packed: `Order #${orderRef} is packed and ready for pickup by courier.`,
    shipped: `Great news! Order #${orderRef} has been shipped. Expected delivery: 2-3 days.`,
    delivered: `Order #${orderRef} delivered successfully! Thank you for shopping with us.`,
    cancelled: `Order #${orderRef} has been cancelled. For queries contact us.`,
  };

  const message = messages[status];
  if (message) {
    await sendSMS(phoneNumber, message);
  }
};