import { tool } from "@langchain/core/tools";
import axios from "axios";
import puppeteer, { HTTPResponse } from "puppeteer-core";
import { ctx } from "../../Context";
import { RequestSubscriber } from "../../utils/RequestSubscriber";

async function getBodyJson(response: HTTPResponse) {
    try {
        // 如果传入的是 Puppeteer 的 Response 对象
        if (response && typeof response.json === 'function') {
            return await response.json();
        }

        // 如果以上都不匹配，返回 null
        return null;
    } catch (error) {
        // console.error('解析响应体为 JSON 时出错:', error);
        return null;
    }
}

export const OpenPageTool = tool(
    // 实现函数：程序知道怎么执行
    async ({ url }) => {
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

        await page.goto(url);

        // 监听请求
        const subscriber = new RequestSubscriber(page)

        subscriber.on('.*', async (response: HTTPResponse) => {
            const data = await getBodyJson(response)

            ctx.setDate({
                requests: [
                    ...ctx.data.requests,
                    {
                        url: response.url(),
                        result: data,
                    }
                ]
            })
        });

        ctx.setDate({
            page
        })
    },

    // 元数据：程序需要的信息
    {
        name: "openPage",           // 工具唯一标识
        description: "打开页面",    // 给LLM看的简短描述
        schema: {                      // 参数验证
            type: "object",
            properties: {
                url: { type: "string" },
            },
            required: ["url"],
        }
    }
);