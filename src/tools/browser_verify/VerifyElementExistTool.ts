import fs from 'fs'
import { tool } from 'langchain';
import path from 'path'
import { ctx } from '../../Context';

async function VerifyElementExist({ selector }: any) {
    console.log('[Tool VerifyElementExistTool] 验证元素是存在:', selector);
    const res = await ctx.page!.waitForSelector(selector, { timeout: 100 }).catch((e) => {
        console.log('eerrr??', e.message)
        throw e
    })
    console.log('[Tool VerifyElementExistTool] 验证元素是存在,结果:', selector, res)
    return res
}

export const VerifyElementExistTool = tool(
    // 实现函数：程序知道怎么执行
    VerifyElementExist,

    // 元数据：程序需要的信息
    {
        name: "VerifyElementExist",           // 工具唯一标识
        description: `判断一个selector能否正确获取元素,当你想操作/获取任何dom元素相关的操作时,如果你不确定元素存在不存在,请先调用这个工具进行判断`,    // 给LLM看的简短描述
        schema: {                      // 参数验证
            type: "object",
            properties: {
                selector: { type: "string" },
            },
            required: ["selector"]
        }
    }
);