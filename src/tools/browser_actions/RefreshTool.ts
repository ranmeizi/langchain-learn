import fs from 'fs'
import { tool } from 'langchain';
import path from 'path'
import { ctx } from '../../Context';

async function Refresh({ selector, direction, top }: { selector: string, direction: string, top: number }) {
    console.log('[Tool RefreshTool] 刷新页面');
    await ctx.page?.reload();
}

export const RefreshTool = tool(
    // 实现函数：程序知道怎么执行
    Refresh,

    // 元数据：程序需要的信息
    {
        name: "Refresh",           // 工具唯一标识
        description: `当你觉得需要重新刷新页面时，调用这个工具，因为很可能随着你的验证操作，浏览器已经将所有数据加载完毕，无法进行后续的操作，这样Refresh一下重置一下初始状态`,    // 给LLM看的简短描述
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