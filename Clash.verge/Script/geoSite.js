// clash nyanpasu 需要更换函数声明为 export default function (params) {
function main(params) {

  // === 常量定义 可按需更换 ===
  const ICON_BASE = "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/";

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

  // === 区域分组定义 ===
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

  // 获取所有有效代理（排除含关键词的）
  const validProxyRegex = /^(?!.*(?:自动|故障|流量|官网|套餐|机场|订阅|年|月|失联|频道|重置))/;
  const allValidProxies = params.proxies
    .filter(p => validProxyRegex.test(p.name))
    .map(p => p.name);

  // 创建区域代理组
  const regionGroups = regions.map(r =>
    createProxyGroup(r.name, "url-test", r.icon, getProxiesByRegex(params.proxies, r.regex))
  );

  // 创建通用策略组（Auto / Balance / Fallback）
  const strategyGroups = [
    createProxyGroup("Auto", "url-test", "Auto.png", allValidProxies),
    createProxyGroup("Balance", "load-balance", "Available.png", allValidProxies),
    createProxyGroup("Fallback", "fallback", "Bypass.png", allValidProxies)
  ];

  // 所有动态代理名称（去重）
  const dynamicProxyNames = [...new Set([
    ...regionGroups.flatMap(g => g.proxies),
    ...allValidProxies
  ].filter(p => p !== "DIRECT"))];

  // === 预定义策略组 ===
  const predefinedGroups = [
    { name: "Final", type: "select", proxies: ["DIRECT", "Global", "Proxy"], icon: "Final.png" },
    { name: "Proxy", type: "select", proxies: dynamicProxyNames.length ? dynamicProxyNames : ["DIRECT"], icon: "Proxy.png" },
    { name: "Global", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", ...regions.map(r => r.name)], icon: "Global.png" },
    { name: "Mainland", type: "select", proxies: ["DIRECT", "Proxy", "Auto", "Balance", "Fallback", ...regions.map(r => r.name)], icon: "Direct.png" },
    { name: "GPT", type: "select", proxies: ["America", "Japan", "Singapore", "TaiWan", "Others", "Proxy"], icon: "AI.png" },
    { name: "YouTube", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", ...regions.map(r => r.name)], icon: "YouTube.png" },
    { name: "BiliBili", type: "select", proxies: ["DIRECT", "HongKong", "TaiWan"], icon: "bilibili.png" },
    { name: "Streaming", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", ...regions.map(r => r.name)], icon: "ForeignMedia.png" },
    { name: "Telegram", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", ...regions.map(r => r.name)], icon: "Telegram.png" },
    { name: "Google", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", ...regions.map(r => r.name)], icon: "Google.png" },
    { name: "Games", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", ...regions.map(r => r.name)], icon: "Game.png" }
  ].map(g => ({
    ...g,
    icon: ICON_BASE + g.icon
  }));

  // === 规则设置 ===
  params["proxy-groups"] = [...predefinedGroups, ...regionGroups, ...strategyGroups];

  params.rules = [
    "AND,(AND,(DST-PORT,443),(NETWORK,UDP)),(NOT,((GEOIP,CN,no-resolve))),REJECT", // QUIC
    // "GEOSITE,Category-ads-all,REJECT", // 可能导致某些网站无法访问
    "GEOSITE,Private,DIRECT",
    "GEOSITE,Openai,GPT",
    "GEOSITE,Google-gemini,GPT",
    "GEOSITE,Category-games@cn,Mainland",
    "GEOSITE,Category-games,Games",
    "GEOSITE,Github,Global",
    "GEOIP,Telegram,Telegram,no-resolve",
    "GEOSITE,Bilibili,BiliBili",
    "GEOSITE,Youtube,YouTube",
    "GEOSITE,Disney,Streaming",
    "GEOSITE,Netflix,Streaming",
    "GEOSITE,HBO,Streaming",
    "GEOSITE,Primevideo,Streaming",
    "GEOSITE,Google,Google",
    "GEOSITE,Microsoft@cn,Mainland",
    "GEOSITE,Apple@cn,Mainland",
    "GEOSITE,Geolocation-!cn,Global",
    "GEOSITE,CN,Mainland",
    "GEOIP,CN,Mainland,no-resolve",
    "MATCH,Final"
  ];

  return params;
}