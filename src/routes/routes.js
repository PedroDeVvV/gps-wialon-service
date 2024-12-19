import express from 'express'
import wialonApiController from "../controllers/wialonApiController.js"

const routes = express();

routes.use("/wialon", wialonApiController);

export default routes;