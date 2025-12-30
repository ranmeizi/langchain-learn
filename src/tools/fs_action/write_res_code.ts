import fs from 'fs'
import { tool } from 'langchain';
import path from 'path'

export const WriteResCodeTool = tool(
    // 实现函数：程序知道怎么执行
    async ({ codeText, name }) => {
        console.log('[tool] writeResCode, codeText:', codeText, name)
        fs.writeFileSync(path.resolve(__dirname,`./result/${name}.ts`), codeText)
    },

    // 元数据：程序需要的信息
    {
        name: "WriteResCodeTool",           // 工具唯一标识
        description: `将输出的代码文件写入特定文件夹`,    // 给LLM看的简短描述
        schema: {                      // 参数验证
            type: "object",
            properties: {
                codeText: { type: "string" },
                name: { type: "string" }
            },
        }
    }
);