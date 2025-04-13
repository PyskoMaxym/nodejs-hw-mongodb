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

export function setupServer() {

    const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve("docs", "swagger.json"), "utf-8"));

    const app = express();
    const PORT =  getEnvVar('PORT', '3002');

    app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocument));

    app.use("/uploads", express.static(path.resolve("src", "uploads")));
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