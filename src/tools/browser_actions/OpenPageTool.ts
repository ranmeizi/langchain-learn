import fs from 'fs'
import { tool } from 'langchain';
import path from 'path'
import { ctx } from '../../Context';

async function OpenPage({ url }: { url: string }) {
    console.log('[Tool OpenPageTool] 打开页面:', url);
    await ctx.page?.goto(url);
}

export const OpenPageTool = tool(
    // 实现函数：程序知道怎么执行
    OpenPage,

    // 元数据：程序需要的信息
    {
        name: "OpenPage",           // 工具唯一标识
        description: `当你需要打开某一个url时,调用这个工具传入url,一般是放在InitializePageTool 后调用`,    // 给LLM看的简短描述
        schema: {                      // 参数验证
            type: "object",
            properties: {
                url: { type: "string" },
            },
            required: ["url"]
        }
    }
);