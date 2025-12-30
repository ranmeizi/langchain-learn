import { ChatOpenAI } from "@langchain/openai";
import 'dotenv/config'
import { createAgent } from "langchain";
import { OpenPageTool } from "./tools/browser_actions/openPage";
import { ClickTool } from "./tools/browser_actions/click";
import { ScrollTool } from "./tools/browser_actions/scroll";
import { EvalOutputTool } from "./tools/browser_actions/evalOutput";
import { GetRectTool } from "./tools/browser_actions/getRect";
import { VerifyAjaxTool } from "./tools/browser_actions/verifyAjax";
import path from "path";
import { readFileSync } from "fs";
import { WriteResCodeTool } from "./tools/fs_action/write_res_code";

const llm = new ChatOpenAI({
    model: "qwen-plus",
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
        tools: [OpenPageTool, ClickTool, ScrollTool, EvalOutputTool, GetRectTool, VerifyAjaxTool,WriteResCodeTool],
    });

    const result = await testingAgent.invoke({
        messages: [
            {
                role: "system",
                content: readFileSync(path.join(__dirname, "../prompts/system/tool.txt")).toString(),
            },
            {
                role: "user",
                content: `请帮我梳理一下 https://discord.com/channels/1188424174012731432/1353165010582638713 
                这个 discord 的消息页面中的消息怎么抓，正常浏览的话，是去滚动他的消息列表，json数据就会随着ajax带回来。
                请先以你的认知执行，我给你工具了，最终需要拿到 message 接口的返回值，你判断一下正确性，如果没问题，请输出一个 typesript 的代码流程给我(注意你应该使用 puppeteer 的api，而不是用我的工具，工具只是方便你验证)，我要运行你的代码，重复你的操作进行数据抓取,
                请通过 WriteResCodeTool 将结果写入文件，文件名为 discord.ts
                再注意一点：
                 // 1. 定义调试地址（通常为 localhost:9222）
                        const debugUrl = 'http://localhost:9222';
                        // 2. 获取浏览器WebSocket端点
                        const { data } = await axios.get(\`\${debugUrl}/json/version\`);
                        const browserWSEndpoint = data.webSocketDebuggerUrl; // 这是动态变化的地址
                        console.log(\`获取到浏览器端点：\${browserWSEndpoint}\`);
                
                        // 3. 使用动态获取的端点进行连接
                        const browser = await puppeteer.connect({
                            browserWSEndpoint: browserWSEndpoint,
                            defaultViewport: null,
                        });
                        console.log('连接成功！');
                
                        // 4. 后续你的自动化操作...
                        const page = await browser.newPage();
                为了使用我浏览器的登录状态，puppeteer务必使用 ws 打开`,
            },
        ],
    },{recursionLimit:100});

    console.log('result', result)
}

// 调用异步函数
main().catch(console.error);