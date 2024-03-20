// Define the `main` function

function main(params) {

  const proxies = [{ name: "🎶 UNM", type: "http", server: "127.0.0.1", port: 8080 }];

  const neteaseMusic = {
    name: "NetEase",
    type: "select",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Netease_Music.png",
    proxies: proxies.map((proxy) => proxy.name).concat("DIRECT")
  };

  const rules = ["PROCESS-NAME,LyricEase.exe,NetEase"];

  const groups = params["proxy-groups"];

  // 插入规则位置，根据需要自行调整
  if (groups.length > 7) {
    params.proxies = (params.proxies || []).concat(proxies);
    groups.splice(7, 0, neteaseMusic);
    params.rules.splice(1, 0, ...rules);
  }

  return params;
}