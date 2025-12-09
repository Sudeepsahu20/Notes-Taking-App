import mongoose, { connections } from "mongoose";

const MONGODB_URI=process.env.MONGODB_URL;

let isConnected=false;

async function dbConnect() {
    try {
        const db=await mongoose.connect(MONGODB_URI);
        if(isConnected) connections[0].readyState===1;
        console.log("Database connected",db)
    } catch (error) {
        console.error("failed to connect to mongoDB",error);
        throw error
    }
}

export default dbConnect;