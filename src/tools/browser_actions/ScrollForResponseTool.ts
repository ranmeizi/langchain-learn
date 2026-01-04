import fs from 'fs'
import { tool } from 'langchain';
import path from 'path'
import { ctx } from '../../Context';

async function ScrollForResponse({ selector, top, pattern, timeout }: { selector: string, direction: string, top: number, pattern: string, timeout: number }) {
    console.log('[Tool ScrollForResponse] 滚动元素:', selector, top);
    await ctx.page?.evaluate(async (selector , top) => {
        const el = document.querySelector<Element>(selector);

        if (!el) {
            return false
        }

        el.scrollBy({
            top,
            behavior: 'smooth'
        });

    }, selector, top)

    return (await ctx.page!.waitForResponse(
        response =>
            (new RegExp(pattern)).test(response.url()) && response.status() === 200,
        {
            timeout
        }
    )).ok()
}

export const ScrollForResponseTool = tool(
    // 实现函数：程序知道怎么执行
    ScrollForResponse,

    // 元数据：程序需要的信息
    {
        name: "ScrollForResponse",           // 工具唯一标识
        description: `滚动一个元素, top是滚动高度,然后等待一个关键请求的响应`,    // 给LLM看的简短描述
        schema: {                      // 参数验证
            type: "object",
            properties: {
                selector: { type: "string" },
                top: { type: "number" },
                pattern: { type: "string" },
                timeout: { type: "number" }
            },
            required: ["selector", 'direction', 'top']
        }
    }
);