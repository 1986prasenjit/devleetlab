import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';

//healthCheck router imports
import healthCheckRouter from "./routes/healthCheck.route.js";

const app = express();

app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.use(express.static("public"))

app.use(cookieParser())

app.use(
    cors({
        origin:process.env.BASE_URL,
        methods:["GET", "POST", "PUT", "DELETE"],
        credentials:true,
        allowedHeaders:["Content-Type", "Authorization"]
    })
)

//healthCheck Routes
app.use("/api/v1/healthCheck", healthCheckRouter)


export default app;