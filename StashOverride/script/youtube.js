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
    "https://www.youtube.com/premium"
  );

  if (error) {
    $done({
      content: "Network Error",
      backgroundColor: "",
    });
    return;
  }

  if (
    data
      .toLowerCase()
      .includes("youtube premium is not available in your country")
  ) {
    $done({
      content: "Not Available",
      backgroundColor: "",
    });
    return;
  }

  if (data.toLowerCase().includes("ad-free")) {
    $done({
      content: `Available`,
      backgroundColor: "#FF0000",
    });
    return;
  }

  $done({
    content: "Unknown Error",
    backgroundColor: "",
  });
}

(async () => {
  main()
    .then((_) => { })
    .catch((error) => {
      $done({});
    });
})();