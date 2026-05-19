import express from "express";
import dotenv from "dotenv";
import url from "./router/url.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/", url);


export default app;
