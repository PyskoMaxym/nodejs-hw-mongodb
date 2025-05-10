import express from "express";
import pino from "pino-http";
import cors from "cors";
import contactRoutes from "./routes/contactRoutes.js";
import { getEnvVar } from "./utils/getEnvVar.js";

export function setupServer() {

    const app = express();
    const PORT =  getEnvVar('PORT', '3002');

    app.use(express.json());
    app.use(cors());
    app.use(pino());

    app.use('/contacts', contactRoutes);


    app.listen( PORT, ()=>{
        console.log(` Server is running on port ${PORT}`);
    })
}   