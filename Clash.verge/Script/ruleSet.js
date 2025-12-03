// clash nyanpasu 需要更换函数声明为 export default function (params) {
function main(params) {

  // === 常量定义 可按需更换 ===
  const ICON_BASE = "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/";
  const RULES_REPO = "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta";
  const DOMAIN_RULE_URL = (name) => `${RULES_REPO}/geo/geosite/${name}.list`;
  const IPCIDR_RULE_URL = (name) => `${RULES_REPO}/geo/geoip/${name}.list`;

  // === 工具函数 ===
  function createProxyGroup(name, type, icon, proxies) {
    const base = {
      name,
      type,
      url: "http://www.gstatic.com/generate_204",
      icon: ICON_BASE + icon,
      interval: 300,
      lazy: true,
      proxies: proxies.length > 0 ? proxies : ["DIRECT"]
    };

    if (type === "url-test") {
      base.tolerance = 20;
      base.timeout = 2000;
    } else if (type === "load-balance") {
      base.strategy = "consistent-hashing";
    }

    return base;
  }

  function getProxiesByRegex(proxies, regex) {
    return proxies.filter(p => regex.test(p.name)).map(p => p.name);
  }

  // === 区域分组 ===
  const regions = [
    { name: "HongKong", regex: /香港|HK|Hong|🇭🇰/, icon: "Hong_Kong.png" },
    { name: "TaiWan", regex: /台湾|TW|Taiwan|Wan|🇹🇼/, icon: "Taiwan.png" },
    { name: "Singapore", regex: /新加坡|狮城|SG|Singapore|🇸🇬/, icon: "Singapore.png" },
    { name: "Japan", regex: /日本|JP|Japan|🇯🇵/, icon: "Japan.png" },
    { name: "America", regex: /美国|US|United\s*States|America|🇺🇸/, icon: "United_States.png" },
    {
      name: "Others",
      regex: /^(?!.*(?:香港|HK|Hong|🇭🇰|台湾|TW|Taiwan|Wan|🇹🇼|新加坡|SG|Singapore|狮城|🇸🇬|日本|JP|Japan|🇯🇵|美国|US|States|America|🇺🇸|自动|故障|流量|官网|套餐|机场|订阅|年|月|失联|频道|重置)).+$/,
      icon: "World_Map.png"
    }
  ];

  const validProxyRegex = /^(?!.*(?:自动|故障|流量|官网|套餐|机场|订阅|年|月|失联|频道|重置))/;
  const allValidProxies = params.proxies
    .filter(p => validProxyRegex.test(p.name))
    .map(p => p.name);

  const regionGroups = regions.map(r =>
    createProxyGroup(r.name, "url-test", r.icon, getProxiesByRegex(params.proxies, r.regex))
  );

  const strategyGroups = [
    createProxyGroup("Auto", "url-test", "Auto.png", allValidProxies),
    createProxyGroup("Balance", "load-balance", "Available.png", allValidProxies),
    createProxyGroup("Fallback", "fallback", "Bypass.png", allValidProxies)
  ];

  const dynamicProxyNames = [...new Set([
    ...regionGroups.flatMap(g => g.proxies),
    ...allValidProxies
  ].filter(p => p !== "DIRECT"))];

  // === 预定义策略组 ===
  const groupDefs = [
    { name: "Final", type: "select", proxies: ["DIRECT", "Global", "Proxy"], icon: "Final.png" },
    { name: "Proxy", type: "select", proxies: dynamicProxyNames.length ? dynamicProxyNames : ["DIRECT"], icon: "Proxy.png" },
    { name: "Global", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", ...regions.map(r => r.name)], icon: "Global.png" },
    { name: "Mainland", type: "select", proxies: ["DIRECT", "Proxy", "Auto", "Balance", "Fallback", ...regions.map(r => r.name)], icon: "Direct.png" },
    { name: "ChatGPT", type: "select", proxies: ["Proxy", "America", "Japan", "Singapore", "TaiWan", "HongKong", "Others"], icon: "ChatGPT.png" },
    { name: "YouTube", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", ...regions.map(r => r.name)], icon: "YouTube.png" },
    { name: "BiliBili", type: "select", proxies: ["DIRECT", "HongKong", "TaiWan"], icon: "bilibili.png" },
    { name: "Streaming", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", ...regions.map(r => r.name)], icon: "ForeignMedia.png" },
    { name: "Telegram", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", ...regions.map(r => r.name)], icon: "Telegram.png" },
    { name: "Google", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", ...regions.map(r => r.name)], icon: "Google.png" },
    { name: "Games", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", ...regions.map(r => r.name)], icon: "Game.png" }
  ];

  const predefinedGroups = groupDefs.map(g => ({
    ...g,
    icon: ICON_BASE + g.icon
  }));

  params["proxy-groups"] = [...predefinedGroups, ...regionGroups, ...strategyGroups];

  // === 规则映射：[规则集名称, 策略组] ===
  const ruleMapping = [
    ["private", "DIRECT"],
    ["openai", "ChatGPT"],
    ["games-cn", "Mainland"],
    ["games", "Games"],
    ["github", "Global"],
    ["bilibili", "BiliBili"],
    ["youtube", "YouTube"],
    ["disney", "Streaming"],
    ["netflix", "Streaming"],
    ["hbo", "Streaming"],
    ["primevideo", "Streaming"],
    ["google", "Google"],
    ["microsoft-cn", "Mainland"],
    ["apple-cn", "Mainland"],
    ["geolocation-!cn", "Global"]
  ];

  // 生成 RULE-SET 规则（domain 类）
  const domainRules = ruleMapping.map(([setName, group]) => `RULE-SET,${setName},${group}`);

  // Telegram IP 规则（单独处理，带 no-resolve）
  const telegramIpRule = "RULE-SET,telegram_ip,Telegram,no-resolve";

  // 最终规则列表
  params.rules = [
    "AND,(AND,(DST-PORT,443),(NETWORK,UDP)),(NOT,((GEOIP,CN,no-resolve))),REJECT", // QUIC
    ...domainRules,
    telegramIpRule,
    "GEOIP,CN,Mainland,no-resolve", // 保留 GEOIP CN 作为兜底
    "MATCH,Final"
  ];

  // === Rule Providers 复用模板 ===
  const makeDomainProvider = (name) => ({
    type: 'http',
    behavior: 'domain',
    format: 'text',
    interval: 86400,
    url: DOMAIN_RULE_URL(name)
  });

  const makeIPProvider = (name) => ({
    type: 'http',
    behavior: 'ipcidr',
    format: 'text',
    interval: 86400,
    url: IPCIDR_RULE_URL(name)
  });

  // 构建 rule-providers
  const ruleProviders = {};
  ruleMapping.forEach(([name]) => {
    ruleProviders[name] = makeDomainProvider(name);
  });
  ruleProviders.telegram_ip = makeIPProvider("telegram");

  params["rule-providers"] = ruleProviders;

  return params;
}