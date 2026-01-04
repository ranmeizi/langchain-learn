import fs from 'fs'
import { tool } from 'langchain';
import path from 'path'
import { ctx } from '../../Context';

async function VerifyElementCanScroll({ selector, direction }: { selector: string, direction: string }) {
    console.log('[Tool VerifyElementCanScrollTool] 验证元素是否可滚动:', selector, direction);
    return await ctx.page?.evaluate(async (selector, direction) => {
        const el = document.querySelector<Element>(selector);

        console.log('[Tool VerifyElementCanScrollTool] 获取元素:', el);

        if (!el) {
            return false
        }

        return await new Promise((resolve, reject) => {
            function onScroll(e: any) {
                console.log('[Tool VerifyElementCanScrollTool] 滚动了');
                resolve(true);
                el!.removeEventListener('scroll', onScroll);
            }
            el.addEventListener('scroll', onScroll);

            setTimeout(() => {
                console.log('[Tool VerifyElementCanScrollTool] 滚动超时');
                el.removeEventListener('scroll', onScroll);
                resolve(false);
            }, 3000);

            el.scrollBy({
                top: direction === 'up' ? -100 : 100,
            });
        });

    }, selector, direction)
}

export const VerifyElementCanScrollTool = tool(
    // 实现函数：程序知道怎么执行
    VerifyElementCanScroll,

    // 元数据：程序需要的信息
    {
        name: "VerifyElementCanScroll",           // 工具唯一标识
        description: `当你觉得一个element 需要滚动前,先要确认这个元素可以按你提供的方向direction和距离top正常滚动,调用这个工具确认, direction='up'|'down' top是滚动高度`,    // 给LLM看的简短描述
        schema: {                      // 参数验证
            type: "object",
            properties: {
                selector: { type: "string" },
                direction: { type: "string" },
            },
            required: ["selector", 'direction']
        }
    }
);