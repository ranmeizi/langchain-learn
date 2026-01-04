import fs from 'fs'
import { tool } from 'langchain';
import path from 'path'
import { ctx } from '../../Context';

function WaitForNetworkIdle({ idleTime }: { idleTime: number }) {
    console.log(`[Tool WaitForNetworkIdleTool] 等待页面初始化请求完毕,截流延迟为${idleTime}ms`);
    return ctx.page!.waitForNetworkIdle({ idleTime })
}

export const WaitForNetworkIdleTool = tool(
    // 实现函数：程序知道怎么执行
    WaitForNetworkIdle,

    // 元数据：程序需要的信息
    {
        name: "WaitForNetworkIdleTool",           // 工具唯一标识
        description: `当你认为需要等待页面初始化请求完毕时,使用这个工具,idleTime是截流延迟`,    // 给LLM看的简短描述
        schema: {                      // 参数验证
            type: "object",
            properties: {
                idleTime: { type: "number" },
            },
        }
    }
);