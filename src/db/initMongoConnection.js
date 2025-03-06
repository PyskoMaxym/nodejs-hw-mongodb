import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;

export async function initMongoConnection() {
    try{
        await mongoose.connect(DB_URI);
        console.log("Mongo connection successfully established!");
    }catch(error){
        console.error("Mongodb connection error",error);
        process.exit(1);
    } 
}