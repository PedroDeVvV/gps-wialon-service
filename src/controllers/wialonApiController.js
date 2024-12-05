import express from "express";
import wialonService from "../services/wialonService.js";
import axios from "axios";

const router = express.Router();

router.get("/authentication", async (req, res) => {
  const data = await wialonService.wialonAuthentication();
  res.status(200).json({
    success: true,
    data: data,
  });
});

router.get("/getItems", async (req, res) => {
  try {
    const sessionId = await wialonService.wialonAuthentication();
    let data = [];

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
      `https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&sid=${sessionId[0].eid}&params=${encodedParams}`
    );

    data.push(response.data);

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (e) {
    console.error("ERRO: ", e.message);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
});

export default router;
