import "dotenv/config";
import axios from "axios";

const apiKey = process.env.TOKEN_WIALON;

async function wialonAuthentication() {
  const data = [];

  await axios
    .get(
      `https://hst-api.wialon.com/wialon/ajax.html?svc=token/login&params={"token":"${apiKey}"}`
    )
    .then((response) => {
      data.push(response.data);
    })
    .catch((e) => {
      console.log("Erro ao fazer requisição no wialon: ", e);
      data.push(e);
    });
  return data;
}

async function wialonGetItems(sid) {
  const data = [];
  const params = {
    spec: {
      itemsType: "avl_unit",
      propName: "sys_name",
      propValueMask: "*",
      sortType: "sys_name",
    },
    force: 1,
    flags: 1025,
    from: 0,
    to: 0,
  };

  const encodedParams = encodeURIComponent(JSON.stringify(params));
  const response = await axios.get(
    `https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&sid=${sid}&params=${encodedParams}`
  );

  data.push(response.data);

  return data;
}

export default { wialonAuthentication, wialonGetItems };
