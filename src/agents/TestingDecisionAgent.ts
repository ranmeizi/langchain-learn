// 📁 src/core/agents/minimal-agent.ts
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

/**
 * 去判断一下用户想做什么
 * 我们处理几种问题
 * 
 * 1. 点击操作
 * 2. 浏览操作
 */

type Decision = any

export class TestingDecisionAgent {
  constructor(private llm: BaseChatModel) {}
  
  async decideAction(userQuery: string): Promise<Decision> {
    // 1. 先让LLM思考该做什么
    const thought = await this.think(userQuery);
    
    // 2. 解析LLM的思考结果
    const decision = this.parseDecision(thought);
    
    return {
      thought,      // LLM的思考过程
      decision,     // 解析出的决策
      timestamp: Date.now()
    };
  }
  
  private async think(query: string): Promise<string> {
    const prompt = `
      用户说：${query}
      
      我是一个精通各种网站的高手,我需要分析用户的意图并考虑应该如何从用户提供的网站中提取用户需要的数据。
      我需要你使用工具推敲，最终调用工具拿到数据，验证用户提供的获取流程的可行性，并最终输出流程图
      
      - 如果需要打开浏览器，返回 OPEN_PAGE:{url}
      - 如果需要点击，返回 CLICK:{selector}
      - 如果需要滚动，返回 SCROLL:{selector}
      - 如果需要获取XHR ，返回 GET_ALL_AJAX:{pattern}
      - 如果需要获取元素中的文字，返回 ELEMENT_2_HTML_STRING:{selector}
      - 如果需要获取元素的位置，返回 GET_RECT:{selector}
      - 如果不知道该干嘛：返回 CANT:{reason}
    `;
    
    const response = await this.llm.invoke(prompt);
    return response.content;
  }
  
  private parseDecision(thought: string): Decision {
    // 简单的解析逻辑
    if (thought.startsWith('FOLLOW:')) {
      const username = thought.replace('FOLLOW:', '').trim();
      return { type: 'follow', username };
    }
    else if (thought.startsWith('SEARCH:')) {
      const keyword = thought.replace('SEARCH:', '').trim();
      return { type: 'search', keyword };
    }
    else if (thought.startsWith('CLARIFY:')) {
      const question = thought.replace('CLARIFY:', '').trim();
      return { type: 'clarify', question };
    }
    else if (thought.startsWith('CANT:')) {
      const reason = thought.replace('CANT:', '').trim();
      return { type: 'cannot', reason };
    }
    else {
      return { type: 'unknown', raw: thought };
    }
  }
}