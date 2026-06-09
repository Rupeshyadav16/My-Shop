import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

const createAdmin = async () => {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("✅ Connected to MongoDB");

    const existing = await User.findOne({ email: ENV.ADMIN_EMAIL });
    if (existing) {
      console.log("✅ Admin already exists!");
      await mongoose.connection.close();
      process.exit(0);
    }

    const admin = await User.create({
      clerkId: "user_3EesLDv5tzan1kVlOGd9bESj58i",
      email: ENV.ADMIN_EMAIL,
      name: "Admin",
    });

    console.log("✅ Admin created:", admin.email);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createAdmin();