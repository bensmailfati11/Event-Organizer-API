import mongoose from "mongoose";

export async function connectMongo(): Promise<void> {
  try {
    const mongoUrl: string | undefined = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error("MONGO_URL environment variable is not defined");
    }
    await mongoose.connect(mongoUrl);
    console.log("🎉 Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
