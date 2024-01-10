import express, { Express } from "express";
import { getConnectedUsers, getUserMessages, sendMessage } from "../controllers/msg.controller";

const route: Express = express();

route.get("/users", getConnectedUsers);
route.get("/messages", getUserMessages);
route.post("/message", sendMessage);

export { route as msgRoutes };
