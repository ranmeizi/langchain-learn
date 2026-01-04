请帮我研究一下 url: https://discord.com/channels/1188424174012731432/1353165010582638713 
这个页面中的右侧滚动列表的数据如何获取，使用 typescript 代码输出一个完整可用的抓取流程，
我给你一些信息：
1. 这个页面的核心接口是 https://discord.com/api/v9/channels/1353165010582638713/messages, 但是不要写死，用他的特征匹配接口名称。
2. 这个数据接口是在页面初始化时候，和列表滚动的时候会请求回来数据
3. 需要滚动的部分中会出现 
    XXXX got XXXX from XXXX (XX%) 或是
    XXXX executed XXXX at XXXX
 等这种句式（X是代表可替换的字符串），请找到对应的滚动区域进行滚动，请向上滚动直到拿到 message 数据

然后最终你需要输出一个完整的抓取流程，最终用代码输出给我一个 message 列表