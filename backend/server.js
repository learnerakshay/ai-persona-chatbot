import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";
import { hiteshPrompt } from "./prompts/hitesh.js";
import { piyushPrompt } from "./prompts/piyush.js";
dotenv.config();
const app = express();
app.use(cors());
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
app.use(express.json()); 
app.get("/", (req, res) => {
    res.send("Backend Working properly ");
});
app.post("/chat", async (req, res) => {
    console.log("CHAT REQUEST RECEIVED");
    console.log(req.body);


    try {
        const { persona, messages } = req.body;

        if (!messages || !messages.length) {
            return res.status(400).json({
                error: "Message Required"
            });
        }

        const selectedPrompt = persona === "piyush" ? piyushPrompt : hiteshPrompt;

        const response = await client.chat.completions.create({
            model: "gpt-5.5",
            messages: [
    {
        role: "system",
        content: selectedPrompt,
    },
    ...messages,
],
        });
        const aiReply = response.choices[0].message.content;
        res.json({
            reply: aiReply
});
    }
    catch(error){
        console.log(error);
        res.status(500).json({

            error:"Something went wrong"
        });
    }
});
app.listen(3000, () => {
    console.log("Server is running on Port 3000");
});
