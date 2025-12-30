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
    await page.waitForSelector('#chat-messages', { timeout: 10000 });

    // 查找可滚动的父容器
    const scrollableSelector = 'div[class*="scroller"][data-list-id="chat-messages"]';
    await page.waitForSelector(scrollableSelector, { timeout: 5000 });

    // 模拟向上滚动以触发历史消息加载
    const messages = [];
    const maxScrollAttempts = 10;
    // @ts-ignore
    let lastHeight = await page.evaluate(() => document.querySelector('div[class*="scroller"][data-list-id="chat-messages"]').scrollHeight);

    for (let i = 0; i < maxScrollAttempts; i++) {
        // 执行滚动
        await page.evaluate((sel) => {
            const el = document.querySelector(sel);
            if (el) {
                el.scrollTop -= 500;
            }
        }, scrollableSelector);

        // 等待网络请求或内容变化
        // @ts-ignore
        await page.waitForTimeout(1500); // 等待加载

        // 检查是否加载了新内容
        // @ts-ignore
        const currentHeight = await page.evaluate(() => document.querySelector('div[class*="scroller"][data-list-id="chat-messages"]').scrollHeight);
        if (currentHeight === lastHeight) {
            console.log('没有更多消息被加载，可能已到达顶部');
            break;
        }
        lastHeight = currentHeight;

        // 可选：抓取当前已加载的消息
        const batch = await page.evaluate(() => {
            const msgEls = Array.from(document.querySelectorAll('[data-list-item-id^="chat-messages-"]'));
            return msgEls.map(el => {
                const id = el.getAttribute('data-list-item-id')?.replace('chat-messages-', '');
                const author = el.querySelector('[class*="sender"]')?.textContent || null;
                const content = el.querySelector('[class*="markup"]')?.textContent || null;
                return { id, author, content };
            }).filter(m => m.content); // 只返回有内容的
        });
        messages.push(...batch);
    }

    console.log(`共抓取到 ${messages.length} 条消息`);

    // 关闭页面（不要关闭浏览器，避免影响人工操作）
    await page.close();
})();