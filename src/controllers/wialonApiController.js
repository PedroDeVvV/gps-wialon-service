import "dotenv/config";
import express from "express";
import wialonService from "../services/wialonService.js";
import sendMessageQueue from "../services/messaging/send.js";


const router = express.Router();

router.get("/authentication", async (req, res) => {
  const data = await wialonService.wialonAuthentication();
  res.status(200).json({
    success: true,
    data: data,
  });
});

router.get("/getItems", async (req, res) => {
  let items = "";
  let sessionId = "";
  try {
    sessionId = await wialonService.wialonAuthentication();
    items = await wialonService.wialonGetItems(sessionId[0].eid);
    items = JSON.stringify(items);
  } catch (e) {
    console.error("ERRO: ", e.message);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }

  const queueName = process.env.QUEUE_NAME;
  res.send(JSON.parse(items));
  sendMessageQueue(queueName, items);
});

export default router;
