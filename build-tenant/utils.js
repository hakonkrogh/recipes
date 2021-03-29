const fetch = require("node-fetch");

const {
  CRYSTALLIZE_ACCESS_TOKEN_ID,
  CRYSTALLIZE_ACCESS_TOKEN_SECRET,
} = process.env;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function simpleCrystallizeFetch({
  uri = "https://pim-dev.crystallize.digital/graphql",
  query,
  variables,
}) {
  let retries = 0;
  return new Promise(async (resolve, reject) => {
    (async function go() {
      const body = JSON.stringify({ query, variables });
      const response = await fetch(uri, {
        method: "post",
        headers: {
          "content-type": "application/json",
          "x-crystallize-access-token-id": CRYSTALLIZE_ACCESS_TOKEN_ID,
          "x-crystallize-access-token-secret": CRYSTALLIZE_ACCESS_TOKEN_SECRET,
        },
        body,
      });

      await sleep(250);

      if (!response.ok) {
        retries++;
        if (retries === 4) {
          setTimeout(go, 60000);
        } else if (retries === 5) {
          reject(await response.text());
        } else {
          setTimeout(go, 3000);
        }
      } else {
        resolve(await response.json());
      }
    })();
  });
}

module.exports = {
  sleep,
  simpleCrystallizeFetch,
};
