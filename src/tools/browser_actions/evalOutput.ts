import { tool } from "@langchain/core/tools";
import puppeteer from "puppeteer-core";
import { ctx } from "../../Context";

export const EvalOutputTool = tool(
    // 实现函数：程序知道怎么执行
    async ({ fnBody, callbackName }) => {

        console.log('[tool] EvalOutputTool', fnBody, callbackName)
        const { page } = ctx

        const result = await page?.evaluate(async (fnBody) => {
            const fn = new Function(fnBody);

            return await fn();
        }, fnBody);

        // @ts-ignore
        const callback: Function | undefined = global[callbackName] as any

        return callback?.(JSON.stringify(result))
    },

    // 元数据：程序需要的信息
    {
        name: "evalOutput",           // 工具唯一标识
        description: "在浏览器 eval 执行一个函数,并以jsonp callback,你需要自己创建fnBody执行浏览器上的任务和global上callbackName的函数接收数据,切记callbackName别重复,并且需要及时销毁global上的callback函数, fnBody 会以Promise事件循环去运行,他的结果会传入callback函数。你可以使用这个调用浏览器api获取你所需要的dom结构，或是执行一些很确切的浏览器操作(不要乱调浏览器api)。",    // 给LLM看的简短描述
        schema: {                      // 参数验证
            type: "object",
            properties: {
                fnBody: { type: "string" },
                callbackName: { type: "string" }
            },
        }
    }
);