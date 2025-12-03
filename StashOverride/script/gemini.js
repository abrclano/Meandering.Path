async function request(method, params) {
  return new Promise((resolve, reject) => {
    const httpMethod = $httpClient[method.toLowerCase()];
    httpMethod(params, (error, response, data) => {
      resolve({ error, response, data });
    });
  });
}

async function main() {
  const { error, response, data } = await request(
    "GET",
    "https://gemini.google.com"
  );

  if (error) {
    $done({
      content: "Network Error",
      backgroundColor: "",
    });
    return;
  }

  if (typeof data !== 'string') {
    $done({
      content: "Failed",
      backgroundColor: "",
    });
    return;
  }

  if (!data.includes('45631641,null,true')) {
    $done({
      content: "Blocked",
      backgroundColor: "",
    });
    return;
  }

  $done({
    content: "Available",
    backgroundColor: "#88A788",
  });
}

(async () => {
  try {
    await main();
  } catch (error) {
    $done({});
  }
})();