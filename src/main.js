import express from "express";
import cors from "cors";
import router from "./routes/routes.js"
import "./services/messaging/send.js";
import axios from 'axios'

const app = express();
let port = process.env.APPLICATION_PORT;

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(express.json());

app.use("/", router);

app.listen(3000, () => {
  console.log(`Server is running on ${port} port`);
});
