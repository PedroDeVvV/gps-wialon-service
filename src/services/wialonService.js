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
      console.log("Erro ao fazer requisicão no wialon authentication: ", e);
    });
  return data;
}

export default { wialonAuthentication };
