async function request(method, url) {
  return new Promise((resolve) => {
    $httpClient[method.toLowerCase()](url, (error, response, data) => {
      resolve({ error, data });
    });
  });
}

function parseCountryFromTrace(traceData) {
  if (typeof traceData !== 'string') return null;
  for (const line of traceData.split('\n')) {
    const [key, value] = line.trim().split('=');
    if (key === 'loc' && value) return value;
  }
  return null;
}

async function main() {
  const { error: checkErr, data: html } = await request("GET", "https://ios.chat.openai.com");

  if (checkErr) {
    return { content: "Network Error" };
  }

  const lower = html.toLowerCase();
  if (lower.includes("disallowed isp")) {
    return { content: "Disallowed ISP" };
  }
  if (lower.includes("been blocked")) {
    return { content: "Blocked" };
  }

  const { data: trace } = await request("GET", "https://chat.openai.com/cdn-cgi/trace");
  const country = parseCountryFromTrace(trace);

  return {
    content: country ? `Available (${country})` : "Available",
    backgroundColor: "#88A788"
  };
}

(async () => {
  try {
    const result = await main();
    $done(result);
  } catch (error) {
    $done({});
  }
})();
