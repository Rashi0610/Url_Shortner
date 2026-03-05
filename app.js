import express from "express"
import dotenv from "dotenv"
import urlRouter from "./routes/urlRoutes.js"
import cors from "cors";


const app = express();
dotenv.config();
app.use(cors())
app.use(express.json());

app.use("/",urlRouter)



export default app;