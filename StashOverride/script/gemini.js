async function request(method, url) {
  return new Promise((resolve) => {
    $httpClient[method.toLowerCase()](url, (error, response, data) => {
      resolve({ error, data });
    });
  });
}

function extractGeminiCountryCode(html) {
  if (typeof html !== 'string') return null;
  const match = html.match(/,2,1,200,"([A-Z]{3})"/);
  return match ? match[1] : null;
}

async function main() {
  const { error, data } = await request("GET", "https://gemini.google.com");

  if (error) {
    return { content: "Network Error" };
  }

  if (typeof data !== 'string') {
    return { content: "Failed" };
  }

  if (!data.includes('45631641,null,true')) {
    return { content: "Blocked" };
  }

  const countryCode = extractGeminiCountryCode(data);
  const content = countryCode ? `Available (${countryCode})` : "Available";
  return { content, backgroundColor: "#88A788" };
}

(async () => {
  try {
    const result = await main();
    $done(result);
  } catch (error) {
    $done({});
  }
})();
