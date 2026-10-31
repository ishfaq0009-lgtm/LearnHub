import mongoose from "mongoose";
import dns from "dns";

// Some hosting providers need Google DNS to resolve SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function dbconection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ DB connection error:", error.message);
    process.exit(1);
  }
}

export default dbconection;