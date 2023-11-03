// Define the `main` function

function main(params) {


  // 香港地区
  const hongKongRegex = /香港|HK|Hong/;
  const hongKongProxies = params.proxies
    .filter((e) => hongKongRegex.test(e.name))
    .map((e) => e.name);
  // 台湾地区
  const taiwanRegex = /台湾|TW|Taiwan/;
  const taiwanProxies = params.proxies
    .filter((e) => taiwanRegex.test(e.name))
    .map((e) => e.name);
  // 狮城地区
  const singaporeRegex = /新加坡|狮城|SG|Singapore/;
  const singaporeProxies = params.proxies
    .filter((e) => singaporeRegex.test(e.name))
    .map((e) => e.name);
  // 日本地区
  const japanRegex = /日本|JP|Japan/;
  const japanProxies = params.proxies
    .filter((e) => japanRegex.test(e.name))
    .map((e) => e.name);
  // 美国地区
  const americaRegex = /美国|US|United States|America/;
  const americaProxies = params.proxies
    .filter((e) => americaRegex.test(e.name))
    .map((e) => e.name);
  // 其他地区
  const othersRegex = /香港|HK|Hong Kong|台湾|TW|TaiWan|新加坡|SG|Singapore|狮城|日本|JP|Japan|美国|US|States|America|Music|自动|故障|流量|官网|套餐|机场|订阅/;
  const othersProxies = params.proxies
    .filter((e) => !othersRegex.test(e.name))
    .map((e) => e.name);
  // 所有地区
  const allRegex = /自动|故障|流量|官网|套餐|机场|订阅/;
  const allProxies = params.proxies
    .filter((e) => !allRegex.test(e.name))
    .map((e) => e.name);

  // 香港
  const HongKong = {
    name: "HongKong",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    interval: 300,
    tolerance: 20,
    lazy: true,
    proxies: hongKongProxies.length > 0 ? hongKongProxies : ["DIRECT"]
  };
  // 台湾
  const TaiWan = {
    name: "TaiWan",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    interval: 300,
    tolerance: 20,
    lazy: true,
    proxies: taiwanProxies.length > 0 ? taiwanProxies : ["DIRECT"]
  };
  // 狮城
  const Singapore = {
    name: "Singapore",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    interval: 300,
    tolerance: 20,
    lazy: true,
    proxies: singaporeProxies.length > 0 ? singaporeProxies : ["DIRECT"]
  };
  // 日本
  const Japan = {
    name: "Japan",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    interval: 300,
    tolerance: 20,
    lazy: true,
    proxies: japanProxies.length > 0 ? japanProxies : ["DIRECT"]
  };
  // 美国
  const America = {
    name: "America",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    interval: 300,
    tolerance: 20,
    lazy: true,
    proxies: americaProxies.length > 0 ? americaProxies : ["DIRECT"]
  };
  // 其他
  const Others = {
    name: "Others",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    interval: 300,
    tolerance: 20,
    lazy: true,
    proxies: othersProxies.length > 0 ? othersProxies : ["DIRECT"]
  };
  // 自动
  const Auto = {
    name: "Auto",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    interval: 300,
    tolerance: 20,
    lazy: true,
    proxies: allProxies.length > 0 ? allProxies : ["DIRECT"]
  };
  // 负载均衡
  const Balance = {
    name: "Balance",
    type: "load-balance",
    url: "http://www.gstatic.com/generate_204",
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
    interval: 300,
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
  const Final = { name: "Final", type: "select", proxies: ["DIRECT", "Global", "Proxy"] };
  // 手动选择
  const Proxy = { name: "Proxy", type: "select", proxies: allProxies.length > 0 ? allProxies : ["DIRECT"] };
  // 国外网站
  const Global = { name: "Global", type: "select", proxies: G };
  // 国内网站
  const Mainland = { name: "Mainland", type: "select", proxies: M };
  // 人工智能
  const ArtIntel = { name: "ArtIntel", type: "select", proxies: AI };
  // 油管视频
  const YouTube = { name: "YouTube", type: "select", proxies: G };
  // 哔哩哔哩
  const BiliBili = { name: "BiliBili", type: "select", proxies: ["DIRECT", "HongKong", "TaiWan"] };
  // 国际媒体
  const Streaming = { name: "Streaming", type: "select", proxies: G };
  // 电报信息
  const Telegram = { name: "Telegram", type: "select", proxies: G };
  // 谷歌服务
  const Google = { name: "Google", type: "select", proxies: G };
  // 游戏平台
  const Games = { name: "Games", type: "select", proxies: G };


  const groups = params["proxy-groups"] = [];
  // 规则
  const rules = [
    "AND,(AND,(DST-PORT,443),(NETWORK,UDP)),(NOT,((GEOIP,CN))),REJECT",// quic
    "GEOSITE,CateGory-Ads-All,REJECT",
    "GEOSITE,Private,DIRECT,no-resolve",
    "GEOSITE,CateGory-Games@cn,DIRECT,no-resolve",
    "GEOSITE,Microsoft@cn,DIRECT,no-resolve",
    "GEOSITE,Apple@cn,DIRECT,no-resolve",
    "GEOIP,Cloudflare,Global,no-resolve",
    "GEOSITE,Bing,ArtIntel,no-resolve",
    "GEOSITE,OpenAI,ArtIntel,no-resolve",
    "GEOSITE,CateGory-Games,Games,no-resolve",
    "GEOSITE,GitHub,Global,no-resolve",
    "GEOSITE,Telegram,Telegram,no-resolve",
    "GEOSITE,Youtube,YouTube,no-resolve",
    "GEOSITE,Disney,Streaming,no-resolve",
    "GEOSITE,Netflix,Streaming,no-resolve",
    "GEOSITE,HBO,Streaming,no-resolve",
    "GEOSITE,PrimeVideo,Streaming,no-resolve",
    "GEOSITE,BiliBili,BiliBili,no-resolve",
    "GEOSITE,Google,Google,no-resolve",
    "GEOSITE,Geolocation-!cn,Global,no-resolve",
    "GEOIP,CN,Mainland,no-resolve",
    "MATCH,Final"
  ];

  // 插入分组
  groups.unshift(HongKong, TaiWan, Japan, Singapore, America, Others, Auto, Balance, Fallback);
  groups.unshift(Final, Proxy, Global, Mainland, ArtIntel, YouTube, BiliBili, Streaming, Telegram, Google, Games);
  // 插入规则
  params.rules = rules;

  return params;
}
