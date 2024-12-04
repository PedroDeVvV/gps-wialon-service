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

export default { wialonAuthentication };
