import express from "express"; 
import dotenv from "dotenv"; 
import cors from "cors";
import { connectDB } from "./DB/connectDB.js";
import path from 'path';

import authRoutes from "../Backend/Routes/authRoutes.js"
import cookieParser from "cookie-parser";

dotenv.config(); 

const app = express(); 
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({origin: "http://localhost:5173",credentials: true }));

app.use(cookieParser());
app.use(express.json()); // this will allow us to parse incoming data req 

app.use("/api/auth", authRoutes); //app.use express.json must be placed before routes **

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/Frontend/dist")));

    app.get("*", (req,res) => {
        res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
    })
}
app.get("/", (req, res) => {
    res.send("Hello World !! "); 
})


app.listen(PORT, ()=>{
    connectDB();
    console.log("Server is running on port :", PORT);
})

//while making changes in mongouri of dotenv restart the server 
