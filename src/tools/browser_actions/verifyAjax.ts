import { tool } from "@langchain/core/tools";
import { ctx } from "../../Context";

export const VerifyAjaxTool = tool(
    // 实现函数：程序知道怎么执行
    async ({ fnBody}) => {
        const fn = new Function(fnBody);
        return fn(ctx.requests)
    },

    // 元数据：程序需要的信息
    {
        name: "VerifyAjaxTool",           // 工具唯一标识
        description: "自己编写 fnBody，我会将我记录的{url:string,result:any}[] 请求都传入你的 fnbody函数，你验证一下是否有你预期的返回值 ",    // 给LLM看的简短描述
        schema: {                      // 参数验证
            type: "object",
            properties: {
                fnBody: { type: "string" }
            },
        }
    }
);