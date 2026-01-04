import { ChatOpenAI } from "@langchain/openai";
import 'dotenv/config'
import { createAgent } from "langchain";
import path from "path";
import { readFileSync } from "fs";
import { tools } from "./tools";


const llm = new ChatOpenAI({
    model: "qwen-turbo",
    apiKey: process.env.DASHSCOPE_API_KEY,
    configuration: {
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        // other params..
    },
    // other params...
});

async function main() {

    const testingAgent = createAgent({
        model: llm,
        tools: tools,
    });

    const result = await testingAgent.invoke({
        messages: [
            {
                role: "system",
                content: readFileSync(path.join(__dirname, "../prompts/system/index.md")).toString(),
            },
            {
                role: "user",
                content: readFileSync(path.join(__dirname, "../prompts/user/discord.md")).toString(),
            }
        ],
    }, { recursionLimit: 100 });

    console.log('result', result)
}

// 调用异步函数
main().catch(console.error);