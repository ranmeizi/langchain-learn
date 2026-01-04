import fs from 'fs'
import { tool } from 'langchain';
import path from 'path'
import { ctx } from '../../Context';

async function Scroll({ selector, direction, top }: { selector: string, direction: string, top: number }) {
    console.log('[Tool ScrollTool] 滚动元素:', selector, direction, top);
    return await ctx.page?.evaluate(async (selector, direction, top) => {
        const el = document.querySelector<Element>(selector);

        if (!el) {
            return false
        }

        el.scrollBy({
            top: direction === 'up' ? -top : top,
            behavior: 'smooth'
        });

    }, selector, direction, top)
}

export const ScrollTool = tool(
    // 实现函数：程序知道怎么执行
    Scroll,

    // 元数据：程序需要的信息
    {
        name: "Scroll",           // 工具唯一标识
        description: `滚动一个元素, direction='up'|'down' top是滚动高度`,    // 给LLM看的简短描述
        schema: {                      // 参数验证
            type: "object",
            properties: {
                selector: { type: "string" },
                direction: { type: "string" },
                top: { type: "number" }
            },
            required: ["selector", 'direction', 'top']
        }
    }
);