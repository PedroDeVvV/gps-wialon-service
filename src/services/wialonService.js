import "dotenv/config";
import axios from "axios";
import database from "../repository/connection.js";

const apiKey = process.env.TOKEN_WIALON;

async function wialonGenerateToken(){
  return "Token novo aqui"
}


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
      console.error("Erro ao fazer requisição no wialon: ", e);
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

  try {
    const encodedParams = encodeURIComponent(JSON.stringify(params));
    const response = await axios.get(
      `https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&sid=${sid}&params=${encodedParams}`
    );
    data.push(response.data);
  } catch (e) {
    console.error("Erro ao requisitar items: ", e);
  }

  return data;
}

function filterName(name) {
  let items = [];
  let category = name.split(" ")[0] || "0000";
  let concessionaire = name.split(" ")[1] || "0000";
  let plate = name.split("(")[1];
  if (!plate) {
    plate = "0000";
  } else {
    plate = plate.split(")")[0];
  }

  items.push(category, concessionaire, plate);

  return items;
}

async function selectedItems(items) {
  const gpsItems = items[0]?.items;
  let itemId,
    category,
    concessionaire,
    name,
    plate,
    longitude,
    latitude,
    date,
    speedAverage;

  for (let i = 0; i < gpsItems.length; i++) {
    let filteredName = filterName(gpsItems[i]?.nm);
    itemId = gpsItems[i]?.id;
    category = filteredName[0];
    concessionaire = filteredName[1];
    plate = filteredName[2];
    name =
      gpsItems[i].nm.split(" ")[3] + " " + gpsItems[i]?.nm.split(" ")[4] || " ";
    latitude = gpsItems[i]?.pos?.y;
    longitude = gpsItems[i]?.pos?.x;
    date = new Date();

    let overspeed = gpsItems[i]?.lmsg?.p?.overspeed || 0;
    let maxSpeed = gpsItems[i]?.lmsg?.p?.max_speed || 0;
    speedAverage = Math.floor((overspeed + maxSpeed) / 2);

    await saveItems(
      itemId,
      category,
      concessionaire,
      name,
      plate,
      longitude,
      latitude,
      date,
      speedAverage
    );
  }
  return;
}

async function saveItems(
  itemId,
  category = "",
  concessionaire = "",
  name,
  plate = "",
  longitude,
  latitude,
  date,
  speedAverage
) {
  const sql =
    "INSERT INTO location_history(item_id, category, concessionaire, name, plate, longitude, latitude, date, speed_average) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);";

  const values = [
    itemId,
    category,
    concessionaire,
    name,
    plate,
    longitude,
    latitude,
    date,
    speedAverage,
  ];

  try {
    const conn = await database.connect();
    await conn.query(sql, values);
    conn.end();
  } catch (e) {
    console.error("Erro ao salvar items: ", e);
  }
}

export default {
  wialonAuthentication,
  wialonGetItems,
  saveItems,
  selectedItems,
  wialonGenerateToken,
};
