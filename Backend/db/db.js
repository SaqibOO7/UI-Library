import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`mongoDB connected`)

    } catch (error) {
        console.log("mongoDB connection Error:", error)
        process.exit(1)
    }
}

export default connectDB