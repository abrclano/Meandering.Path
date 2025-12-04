async function request(method, url) {
  return new Promise((resolve) => {
    $httpClient[method.toLowerCase()](url, (error, response) => {
      resolve({ error, response });
    });
  });
}

function extractCountry(response) {
  const url = response?.headers?.["X-Originating-Url"];
  if (!url || typeof url !== "string") return null;
  const loc = url.split("/")[3];
  return loc === "title" ? "us" : (loc?.split("-")[0] ?? null);
}

async function main() {
  const { error: err1, response: res1 } = await request("GET", "https://www.netflix.com/title/70143836");
  if (!err1) {
    const country = extractCountry(res1);
    if (country) {
      return { content: `No Restriction (${country.toUpperCase()})`, backgroundColor: "#E50914" };
    }
  }

  const { error: err2, response: res2 } = await request("GET", "https://www.netflix.com/title/80197526");
  if (!err2) {
    const country = extractCountry(res2);
    if (country) {
      return { content: `Originals Only (${country.toUpperCase()})`, backgroundColor: "#E50914" };
    }
  }

  return { content: "Not Available", backgroundColor: "" };
}

(async () => {
  try {
    const result = await main();
    $done(result);
  } catch (error) {
    $done({});
  }
})();
