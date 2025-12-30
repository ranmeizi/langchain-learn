import { tool } from "@langchain/core/tools";
import { ctx } from "../../Context";

export const GetRectTool = tool(
    // 实现函数：程序知道怎么执行
    async ({ selector }) => {
        console.log('[tool]  getRect, selector:', selector)
        const { page } = ctx

        const rect = await page?.$eval(selector, (el) => {
            const rect = el.getBoundingClientRect();
            return {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            };
        });

        return rect
    },

    // 元数据：程序需要的信息
    {
        name: "getRect",           // 工具唯一标识
        description: "获取元素位置",    // 给LLM看的简短描述
        schema: {                      // 参数验证
            type: "object",
            properties: {
                selector: { type: "string" },
            },
            required: ["selector"],
        }
    }
);