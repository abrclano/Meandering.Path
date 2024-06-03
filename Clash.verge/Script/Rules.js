function main(params) {

  // 创建代理组的函数
  function createProxyGroup(name, type, icon, proxies) {
    return {
      name,
      type,
      url: "http://www.gstatic.com/generate_204",
      icon,
      interval: 300,
      tolerance: type === "url-test" ? 20 : undefined,
      timeout: type === "url-test" ? 2000 : undefined,
      lazy: true,
      proxies: proxies.length > 0 ? proxies : ["DIRECT"],
      strategy: type === "load-balance" ? "consistent-hashing" : undefined
    };
  }

  // 通过正则表达式获取代理的函数
  function getProxiesByRegex(params, regex) {
    return params.proxies
      .filter(e => regex.test(e.name))
      .map(e => e.name);
  }

  // 定义区域及其正则表达式
  const regions = [
    { name: "HongKong", regex: /香港|HK|Hong|🇭🇰/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Hong_Kong.png" },
    { name: "TaiWan", regex: /台湾|TW|Taiwan|Wan|🇨🇳|🇹🇼/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Taiwan.png" },
    { name: "Singapore", regex: /新加坡|狮城|SG|Singapore|🇸🇬/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Singapore.png" },
    { name: "Japan", regex: /日本|JP|Japan|🇯🇵/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Japan.png" },
    { name: "America", regex: /美国|US|United States|America|🇺🇸/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_States.png" },
    { name: "Others", regex: /^(?!.*(?:香港|HK|Hong|🇭🇰|台湾|TW|Taiwan|Wan|🇨🇳|🇹🇼|新加坡|SG|Singapore|狮城|🇸🇬|日本|JP|Japan|🇯🇵|美国|US|States|America|🇺🇸|自动|故障|流量|官网|套餐|机场|订阅|年|月)).*$/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/World_Map.png" },
    { name: "Auto", regex: /^(?!.*(?:自动|故障|流量|官网|套餐|机场|订阅|年|月|失联|频道)).*$/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Auto.png", type: "url-test" },
    { name: "Balance", regex: /^(?!.*(?:自动|故障|流量|官网|套餐|机场|订阅|年|月|失联|频道)).*$/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Available.png", type: "load-balance" },
    { name: "Fallback", regex: /^(?!.*(?:自动|故障|流量|官网|套餐|机场|订阅|年|月|失联|频道)).*$/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Bypass.png", type: "fallback" }
  ];

  // 创建代理组
  const proxyGroups = regions.map(region =>
    createProxyGroup(region.name, region.type || "url-test", region.icon, getProxiesByRegex(params, region.regex))
  );

  // 预定义代理组
  const predefinedGroups = [
    { name: "Final", type: "select", proxies: ["DIRECT", "Global", "Proxy"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Final.png" },
    { name: "Proxy", type: "select", proxies: ["Auto", ...new Set(proxyGroups.flatMap(g => g.proxies))], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Proxy.png" },
    { name: "Global", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Global.png" },
    { name: "Mainland", type: "select", proxies: ["DIRECT", "Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Round_Robin.png" },
    { name: "ArtIntel", type: "select", proxies: ["Proxy", "America", "Japan", "Singapore", "TaiWan", "HongKong", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Copilot.png" },
    { name: "YouTube", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/YouTube.png" },
    { name: "BiliBili", type: "select", proxies: ["DIRECT", "HongKong", "TaiWan"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/bilibili.png" },
    { name: "Streaming", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/ForeignMedia.png" },
    { name: "Telegram", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Telegram.png" },
    { name: "Google", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Google.png" },
    { name: "Games", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Game.png" }
  ];

  // 插入分组
  params["proxy-groups"] = [...predefinedGroups, ...proxyGroups];

  // 插入规则
  params.rules = [
    "AND,(AND,(DST-PORT,443),(NETWORK,UDP)),(NOT,((GEOIP,CN,no-resolve))),REJECT",// quic
    // "GEOSITE,Category-ads-all,REJECT",// 可能导致某些网站无法访问
    "GEOSITE,Private,DIRECT",
    "GEOSITE,Bing,ArtIntel",
    "GEOSITE,Openai,ArtIntel",
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
    "DOMAIN-REGEX,\.(interactivebrokers|ibkr|ibllc)\.com\.cn,DIRECT",
    "DOMAIN-REGEX,\.(interactivebrokers|ibkr|ibllc)\.(com|info),Global",
    "DOMAIN-SUFFIX,hk,Global",
    "DOMAIN-SUFFIX,annas-archive.org,Global",
    "MATCH,Final"
  ];

  /***
   *** 使用远程规则资源示例
   *** 使用时须在rules中添加对应规则
   *** E.G
       "RULE-SET,telegram_domain,Telegram",
       "RULE-SET,telegram_ip,Telegram,no-resolve"
   */
  /***
  // 远程规则类型
  const ruleAnchor = {
    ip: { type: 'http', interval: 86400, behavior: 'ipcidr', format: 'text' },
    domain: { type: 'http', interval: 86400, behavior: 'domain', format: 'text' }
  };
  // 远程规则资源
  const ruleProviders = {
    telegram_domain: { ...ruleAnchor.domain, url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/telegram.list' },
    telegram_ip: { ...ruleAnchor.ip, url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/telegram.list' }
  };
  // 插入远程规则
  params["rule-providers"] = ruleProviders;
   */

  return params;
}
