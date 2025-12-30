import { tool } from "@langchain/core/tools";

export const ClickTool = tool(
    // 实现函数：程序知道怎么执行
    async ({ selector, x, y }) => {
        console.log('[tool] click, selector:', selector,x,y)
    },

    // 元数据：程序需要的信息
    {
        name: "click",           // 工具唯一标识
        description: "点击",    // 给LLM看的简短描述
        schema: {                      // 参数验证
            type: "object",
            properties: {
                selector: { type: "string" },
                x: { type: "number" },
                y: { type: "number" }
            },
        }
    }
);