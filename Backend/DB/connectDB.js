import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("Error while connecting to MongoDB", error.message)
        process.exit(1) // Note : 1 is a failure, 0 status code is for success
    }
};