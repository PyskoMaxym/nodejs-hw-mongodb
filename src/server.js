import express from "express";
import pino from "pino-http";
import cors from "cors";
import cookieParser, { JSONCookie } from "cookie-parser";
import contactRoutes from "./routes/contactRoutes.js";
import { getEnvVar } from "./utils/getEnvVar.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import  authRoutes  from "./routes/auth.js";
import { auth } from "./middlewares/auth.js";
import path from "node:path";
import * as fs from "node:fs"
import swaggerUiExpress from "swagger-ui-express";
import { swaggerDocs } from "./middlewares/swaggerDocs.js";

export function setupServer() {

    const app = express();
    const PORT =  getEnvVar('PORT', '3002');

    

    app.use("/uploads", express.static(path.resolve("src", "uploads")));
    app.use('/api-docs', swaggerDocs());
    app.use(express.json());
    app.use(cors());
    app.use(pino({ level: "warn" }));
    app.use(cookieParser());
    
    app.get('/', (req, res) => {
        res.send('Welcome to the API!');
    });

    app.use("/auth", authRoutes);
    app.use('/contacts', auth, contactRoutes);

    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen( PORT, ()=>{
        console.log(` Server is running on port ${PORT}`);
    })
}   