import "dotenv/config";
import express from "express";
import wialonService from "../services/wialonService.js";
import sendMessageQueue from "../services/messaging/send.js";

const router = express.Router();

router.get("/getItems", async (req, res) => {
  
  let token;
  let items;
  let sessionId;
  try {
    token = await wialonService.wialonGenerateToken();
    sessionId = await wialonService.wialonAuthentication();
    items = await wialonService.wialonGetItems(sessionId[0].eid);
    items = JSON.stringify(items);
    await wialonService.selectedItems(JSON.parse(items));
  } catch (e) {
    console.error("ERRO: ", e.message);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }

  let dataJson = JSON.parse(items);
  const queueName = process.env.QUEUE_NAME;
  res.status(200).json({
    success: true,
    token: token,
    data: dataJson[0].items,
  });
  sendMessageQueue(queueName, items);
});

export default router;
