import express from "express";
import dotenv from "dotenv";
import { databaseConnection } from "./database/databaseConnection.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
app.use(cors({origin:"http://localhost:5173", credentials:true}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/client/dist")));

    app.get("*", (req, res)=>{
        res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
    })
}

app.listen(PORT, async ()=>{
    await databaseConnection();
    console.log("listening to port", PORT)
})



