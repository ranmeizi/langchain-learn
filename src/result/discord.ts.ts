import puppeteer from 'puppeteer-core';
import axios from 'axios';

(async () => {
    // 1. 定义调试地址（通常为 localhost:9222）
    const debugUrl = 'http://localhost:9222';
    
    // 2. 获取浏览器WebSocket端点
    const { data } = await axios.get(`${debugUrl}/json/version`);
    const browserWSEndpoint = data.webSocketDebuggerUrl; // 这是动态变化的地址
    console.log(`获取到浏览器端点：${browserWSEndpoint}`);
    
    // 3. 使用动态获取的端点进行连接
    const browser = await puppeteer.connect({
        browserWSEndpoint: browserWSEndpoint,
        defaultViewport: null,
    });
    console.log('连接成功！');

    // 4. 后续你的自动化操作...
    const page = await browser.newPage();
    await page.goto('https://discord.com/channels/1188424174012731432/1353165010582638713', {
        waitUntil: 'networkidle2'
    });

    // 等待消息容器加载
    await page.waitForSelector('[data-list-id=chat-messages]', { timeout: 10000 });
    console.log('消息列表已加载');

    // 开启请求监听，捕获 /messages 接口返回
    // @ts-ignore
    await page.on('response', async (response) => {
        if (response.url().includes('/messages') && response.status() === 200) {
            try {
                const json = await response.json();
                if (json.messages) {
                    console.log(`[API] 捕获到消息批次: ${json.messages.length} 条`);
                    console.log(`最新消息ID: ${json.messages[0][0]?.id}`);
                    // 可以将数据写入文件或数据库
                }
            } catch (e) {
                 // @ts-ignore
                console.warn('[Response] 解析失败:', e.message);
            }
        }
    });

    // 模拟多次向上滚动以加载历史消息
    for (let i = 0; i < 10; i++) {
        await page.evaluate(() => {
            const el = document.querySelector('[data-list-id=chat-messages]');
            if (el) {
                el.scrollBy({ top: -800, behavior: 'smooth' });
            }
        });

        // 等待加载更多内容
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('滚动完成，所有可用消息应已加载');

    // 最后断开连接（可选）
    // await browser.disconnect();
})();