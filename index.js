import express from "express";
import "express-async-errors";
import cors from "cors";

import { errorHandler } from "./errors.js";

//LeadBot
import LeadBotHook from "./bot.js"

const app = express();
app.use(cors());
app.use(express.json());

app.listen(process.env.API_PORT, () => {
    console.log(`Listening port ${process.env.API_PORT}`);
});
//Бодкллючение LeadBot
app.use("/bot", LeadBotHook);

app.use(errorHandler);