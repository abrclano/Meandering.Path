async function request(method, url) {
  return new Promise((resolve) => {
    $httpClient[method.toLowerCase()](url, (error, response, data) => {
      resolve({ error, data });
    });
  });
}

function extractCountryCode(html) {
  const match = html.match(/"GL"\s*:\s*"([A-Z]{2})"/);
  return match ? match[1] : null;
}

async function main() {
  const { error, data } = await request("GET", "https://www.youtube.com/premium");

  if (error) {
    return { content: "Network Error" };
  }

  if (typeof data !== "string") {
    return { content: "Unknown Error" };
  }

  const lower = data.toLowerCase();

  if (lower.includes("youtube premium is not available in your country")) {
    return { content: "Not Available" };
  }

  if (lower.includes("ad-free")) {
    const countryCode = extractCountryCode(data);
    const content = countryCode ? `Available (${countryCode})` : "Available";
    return { content, backgroundColor: "#FF0000" };
  }

  return { content: "Unknown Error" };
}

(async () => {
  try {
    const result = await main();
    $done(result);
  } catch (error) {
    $done({});
  }
})();
