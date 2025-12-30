import { tool } from "@langchain/core/tools";
import { ctx } from "../../Context";

export const ScrollTool = tool(
    // 实现函数：程序知道怎么执行
    async ({ selector, direction }) => {
        console.log('[tool] scroll, selector:', selector, direction)
        const { page } = ctx

        await page?.evaluate(({ selector }) => {
            const el = document.querySelector<HTMLOListElement>(selector)!;

            el.scrollBy({
                top: direction === 'up' ? -500 : 500,
                behavior: 'smooth'  // 关键：启用平滑滚动
            });
        }, { selector });
    },

    // 元数据：程序需要的信息
    {
        name: "scroll",           // 工具唯一标识
        description: `滚动 el.scrollBy({
                top: direction === 'up' ? -500 : 500,
                behavior: 'smooth'  // 关键：启用平滑滚动
            })`,    // 给LLM看的简短描述
        schema: {                      // 参数验证
            type: "object",
            properties: {
                selector: { type: "string" },
                direction: { type: "string" }
            },
        }
    }
);