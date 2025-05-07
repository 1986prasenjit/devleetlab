import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';

//healthCheck router imports
import healthCheckRoute from "./routes/healthCheck.route.js";

//user routes imports
import registerUserRoute from "./routes/user.route.js";

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

//healthCheck Route
app.use("/api/v1/healthCheck", healthCheckRoute)

//user register Route
app.use("/api/v1/user", registerUserRoute)


export default app;