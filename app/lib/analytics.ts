// 简单的爬虫 User-Agent 列表 (可以根据需要扩展)
const BOT_USER_AGENTS = [
  'googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'baiduspider',
  'slurp', 'petalbot', 'semrushbot', 'ahrefsbot', 'mj12bot',
  'dotbot', 'exabot', 'facebot', 'pinterestbot', 'twitterbot',
  'linkedinbot', 'discordbot', 'telegrambot', 'whatsapp', 'applebot',
  'screaming frog', 'headlesschrome', 'phantomjs', 'puppeteer',
  'curl', 'wget', 'python-requests', 'go-http-client', 'okhttp',
  'postmanruntime', 'insomnia', 'axios', 'fetch', 'node-fetch'
];

/**
 * 判断 User-Agent 是否为已知爬虫或自动化脚本
 * @param userAgent - 用户的 User-Agent 字符串
 */
export function isBot(userAgent?: string): boolean {
  if (!userAgent) return false;
  const lowerCaseUserAgent = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => lowerCaseUserAgent.includes(bot));
}

// trackAnalyticsEvent 将不再直接使用，而是通过 Firebase logEvent
// 如果你需要记录自定义事件，可以直接在组件中调用 logEvent