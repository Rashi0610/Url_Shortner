import express from "express"
import dotenv from "dotenv"
import urlRouter from "./routes/urlRoutes.js"
import cors from "cors";
import { fileURLToPath } from "node:url";
import path from "node:path";



const app = express();
const _filename=fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

app.use(express.static(path.join(_dirname,"frontend")));
dotenv.config();
app.use(cors())
app.use(express.json());


app.use("/",urlRouter)



export default app;