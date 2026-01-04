import fs from 'fs'
import { tool } from 'langchain';
import path from 'path'
import { ctx } from '../../Context';

type Node = {
    tagName: string,
    className: string,
    children: Node[]
}
async function GetSimpleNodeWithSearchKeyWord({ selector, deepth = 10, searchWord }: { selector: string, deepth?: number, searchWord?: string }) {
    console.log(`[Tool GetSimpleNodeWithSearchKeyWord] 获取:${selector} 元素的结构 deepth:${deepth} searchWord:${searchWord}`);
    const json = await ctx.page?.evaluate(async (selector, deepth, searchWord) => {
        let root = null
        const el = document.querySelector<Element>(selector);

        function dehydrate(els: any[], deepth: number): Node[] {
            return Array.from(els).filter(child => {
                if (searchWord) {
                    return child.textContent.includes(searchWord)
                } else {
                    return true
                }
            }).map(child => {
                return {
                    tagName: child.tagName,
                    className: child.className,
                    children: dehydrate(child.children, deepth - 1)
                };
            });
        }

        if (el) {
            root = dehydrate([el], deepth);
        }

        return JSON.stringify(root);
    }, selector, deepth, searchWord)

    console.log(`[Tool GetSimpleNodeWithSearchKeyWord] 结果:${json}`);

    return json
}

export const GetSimpleNodeWithSearchKeyWordTool = tool(
    // 实现函数：程序知道怎么执行
    GetSimpleNodeWithSearchKeyWord,

    // 元数据：程序需要的信息
    {
        name: "GetSimpleNodeWithSearchKeyWord",           // 工具唯一标识
        description: `查询selector 和他的子节点的简单结构,以json输出,会限制deepth深度(默认10 最大10),提取出关键tagName 和 class 等等信息,还可以传入 searchWord 查询这个元素中有没有这段文字内容，当你想确认元素是否是承载关键数据的元素，可以调用这个工具判断`,    // 给LLM看的简短描述
        schema: {                      // 参数验证
            type: "object",
            properties: {
                selector: { type: "string" },
                deepth: { type: "number" },
                searchWord: { type: "string" },
            },
            required: ["selector"]
        }
    }
);