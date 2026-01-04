import fs from 'fs'
import { tool } from 'langchain';
import path from 'path'
import { ctx } from '../../Context';

async function WaitForResponse({ pattern, timeout }: any) {
    console.log(`[Tool WaitForResponseTool] 匹配请求:${pattern}`);
    return (await ctx.page!.waitForResponse(
        response =>
            (new RegExp(pattern)).test(response.url()) && response.status() === 200,
        {
            timeout
        }
    )).ok()
}

export const WaitForResponseTool = tool(
    // 实现函数：程序知道怎么执行
    WaitForResponse,

    // 元数据：程序需要的信息
    {
        name: "WaitForResponse",           // 工具唯一标识
        description: `当你期待一个操作触发app的某些关键请求时,调用这个工具,传入需要匹配请求的pattern,timeout超时时间,注意,这个函数需要在`,    // 给LLM看的简短描述
        schema: {                      // 参数验证
            type: "object",
            properties: {
                pattern: { type: "string" },
                timeout: { type: "number" }
            },
            required: ["pattern"]
        }
    }
);