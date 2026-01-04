import fs from 'fs'
import { tool } from 'langchain';
import path from 'path'

export const WriteResCodeTool = tool(
    // 实现函数：程序知道怎么执行
    async ({ codeText, name }: { codeText: string; name: string }) => {
        console.log('[tool] writeResCode, codeText:', codeText, name)
        const targetDir = path.resolve(process.cwd(), 'src/result')
        const filePath = path.join(targetDir, `${name}.ts`)
        fs.mkdirSync(targetDir, { recursive: true })
        fs.writeFileSync(filePath, codeText, { encoding: 'utf8' })
        return { path: filePath }
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
            required: ["codeText", "name"]
        }
    }
);