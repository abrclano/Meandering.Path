// Define the `main` function

function main(params) {

  // 香港地区
  const hongKongRegex = /香港|HK|Hong|🇭🇰/;
  const hongKongProxies = getProxiesByRegex(params, hongKongRegex);
  // 台湾地区
  const taiwanRegex = /台湾|TW|Taiwan|Wan|🇨🇳|🇹🇼/;
  const taiwanProxies = getProxiesByRegex(params, taiwanRegex);
  // 狮城地区
  const singaporeRegex = /新加坡|狮城|SG|Singapore|🇸🇬/;
  const singaporeProxies = getProxiesByRegex(params, singaporeRegex);
  // 日本地区
  const japanRegex = /日本|JP|Japan|🇯🇵/;
  const japanProxies = getProxiesByRegex(params, japanRegex);
  // 美国地区
  const americaRegex = /美国|US|United States|America|🇺🇸/;
  const americaProxies = getProxiesByRegex(params, americaRegex);
  // 其他地区
  const othersRegex = /^(?!.*(?:香港|HK|Hong|🇭🇰|台湾|TW|Taiwan|Wan|🇨🇳|🇹🇼|新加坡|SG|Singapore|狮城|🇸🇬|日本|JP|Japan|🇯🇵|美国|US|States|America|🇺🇸|自动|故障|流量|官网|套餐|机场|订阅|年|月|公益|时间|过期|无效|注册|回国|产品|免费|体验|广告位|请|群|官?网[站址]?|等级[12]|[vV](ip|IP)?[01])).*$/;
  const othersProxies = getProxiesByRegex(params, othersRegex);
  // 所有地区
  const allRegex = /^(?!.*(?:自动|故障|流量|官网|套餐|机场|订阅|年|月|失联|频道|公益|时间|过期|无效|注册|回国|产品|免费|体验|广告位|请|群|官?网[站址]?|等级[12]|[vV](ip|IP)?[01])).*$/;
  const allProxies = getProxiesByRegex(params, allRegex);

  // 香港
  const HongKong = {
    name: "HongKong",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Hong_Kong.png",
    interval: 300,
    tolerance: 20,
    timeout: 2000,
    lazy: true,
    proxies: hongKongProxies.length > 0 ? hongKongProxies : ["DIRECT"]
  };
  // 台湾
  const TaiWan = {
    name: "TaiWan",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Taiwan.png",
    interval: 300,
    tolerance: 20,
    timeout: 2000,
    lazy: true,
    proxies: taiwanProxies.length > 0 ? taiwanProxies : ["DIRECT"]
  };
  // 狮城
  const Singapore = {
    name: "Singapore",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Singapore.png",
    interval: 300,
    tolerance: 20,
    timeout: 2000,
    lazy: true,
    proxies: singaporeProxies.length > 0 ? singaporeProxies : ["DIRECT"]
  };
  // 日本
  const Japan = {
    name: "Japan",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Japan.png",
    interval: 300,
    tolerance: 20,
    timeout: 2000,
    lazy: true,
    proxies: japanProxies.length > 0 ? japanProxies : ["DIRECT"]
  };
  // 美国
  const America = {
    name: "America",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_States.png",
    interval: 300,
    tolerance: 20,
    timeout: 2000,
    lazy: true,
    proxies: americaProxies.length > 0 ? americaProxies : ["DIRECT"]
  };
  // 其他
  const Others = {
    name: "Others",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/World_Map.png",
    interval: 300,
    tolerance: 20,
    timeout: 2000,
    lazy: true,
    proxies: othersProxies.length > 0 ? othersProxies : ["DIRECT"]
  };
  // 自动
  const Auto = {
    name: "Auto",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Auto.png",
    interval: 300,
    tolerance: 20,
    timeout: 2000,
    lazy: true,
    proxies: allProxies.length > 0 ? allProxies : ["DIRECT"]
  };
  // 负载均衡
  const Balance = {
    name: "Balance",
    type: "load-balance",
    url: "http://www.gstatic.com/generate_204",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Available.png",
    interval: 300,
    strategy: "consistent-hashing",
    lazy: true,
    proxies: allProxies.length > 0 ? allProxies : ["DIRECT"]
  };
  // 故障转移
  const Fallback = {
    name: "Fallback",
    type: "fallback",
    url: "http://www.gstatic.com/generate_204",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Bypass.png",
    interval: 300,
    timeout: 2000,
    lazy: true,
    proxies: allProxies.length > 0 ? allProxies : ["DIRECT"]
  };

  // 国外分组
  const G = ["Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"];
  // 国内分组
  const M = ["DIRECT", "Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"];
  // AI分组
  const AI = ["Proxy", "America", "Japan", "Singapore", "TaiWan", "HongKong", "Others"];

  // 漏网之鱼
  const Final = { name: "Final", type: "select", proxies: ["DIRECT", "Global", "Proxy"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Final.png" };
  // 手动选择
  const Proxy = { name: "Proxy", type: "select", proxies: ["Auto", ...(allProxies.length > 0 ? allProxies : ["DIRECT"])], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Proxy.png" };
  // 国外网站
  const Global = { name: "Global", type: "select", proxies: G, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Global.png" };
  // 国内网站
  const Mainland = { name: "Mainland", type: "select", proxies: M, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Round_Robin.png" };
  // 人工智能
  const ArtIntel = { name: "ArtIntel", type: "select", proxies: AI, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Copilot.png" };
  // 油管视频
  const YouTube = { name: "YouTube", type: "select", proxies: G, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/YouTube.png" };
  // 哔哩哔哩
  const BiliBili = { name: "BiliBili", type: "select", proxies: ["DIRECT", "HongKong", "TaiWan"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/bilibili.png" };
  // 国际媒体
  const Streaming = { name: "Streaming", type: "select", proxies: G, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/ForeignMedia.png" };
  // 电报信息
  const Telegram = { name: "Telegram", type: "select", proxies: G, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Telegram.png" };
  // 谷歌服务
  const Google = { name: "Google", type: "select", proxies: G, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Google.png" };
  // 游戏平台
  const Games = { name: "Games", type: "select", proxies: G, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Game.png" };
  // 插入分组
  const groups = params["proxy-groups"] = [];
  groups.unshift(HongKong, TaiWan, Japan, Singapore, America, Others, Auto, Balance, Fallback);
  groups.unshift(Final, Proxy, Global, Mainland, ArtIntel, YouTube, BiliBili, Streaming, Telegram, Google, Games);

  // 规则
  const rules = [
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
    "DOMAIN-KEYWORD,interactivebrokers,Global",
    "MATCH,Final"
  ];
  // 插入规则
  params.rules = rules;

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

function getProxiesByRegex(params, regex) {
  return params.proxies
    .filter((e) => regex.test(e.name))
    .map((e) => e.name);
}
