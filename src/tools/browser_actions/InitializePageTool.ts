import { tool } from "@langchain/core/tools";
import axios from "axios";
import puppeteer, { HTTPResponse } from "puppeteer-core";
import { ctx } from "../../Context";
import { RequestSubscriber } from "../../utils/RequestSubscriber";

async function InitializePage() {
    console.log('[Tool InitializePageTool] 开始初始化页面...');
    // 1. 定义调试地址（通常为 localhost:9222）
    const debugUrl = 'http://localhost:9222';
    // 2. 获取浏览器WebSocket端点
    const { data } = await axios.get(`${debugUrl}/json/version`);
    const browserWSEndpoint = data.webSocketDebuggerUrl; // 这是动态变化的地址
    console.log(`获取到浏览器端点：${browserWSEndpoint}`);

    // 3. 使用动态获取的端点进行连接
    const browser = await puppeteer.connect({
        browserWSEndpoint: browserWSEndpoint,
        defaultViewport: null,
    });
    console.log('连接成功！');

    // 4. 后续你的自动化操作...
    const page = await browser.newPage();

    // 动态获取浏览器窗口的内部尺寸并设为视口
    const { width, height } = await page.evaluate(() => ({
        width: window.innerWidth,
        height: window.innerHeight
    }));
    await page.setViewport({ width, height });

    ctx.setDate({
        page
    })
}

export const InitializePageTool = tool(
    InitializePage,

    // 元数据：程序需要的信息
    {
        name: "InitializePageTool",           // 工具唯一标识
        description: "打开一个新tab页,当你想好要进行什么操作时,一定要确保已经调用 InitializePageTool 初始化Page,这是一切操作的开端,不自动打开url,请调用OpenPageTool打开网址,目前只能调用一次!",    // 给LLM看的简短描述
        schema: {                      // 参数验证
            type: "object",
            properties: {
                url: { type: "string" },
            },
            required: ["url"],
        }
    }
);