import express from "express";
import cors from "cors";
import router from "./routes/routes.js"
import "./services/messaging/send.js";


const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(express.json());

app.use("/", router);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
