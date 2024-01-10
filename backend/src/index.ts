import express, { Express, Request, Response } from "express";
import { authRoutes } from "./routes/auth.routes";
import { msgRoutes } from "./routes/msg.routes";
import { createServer } from "http";
import dotenv from "dotenv";
import cacheNode from "node-cache";
import { WebSocket } from "ws";
import cors from "cors";

dotenv.config();
export const myCache = new cacheNode({ deleteOnExpire: false, stdTTL: 0 });

const app: Express = express();
const port = process.env.PORT ?? 5050;

// Config options
const allowedOrigins = ["http://localhost:3030"];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(options));
app.use(express.json());

// Basic routes
app.use("/auth", authRoutes);
app.use("/messaging", msgRoutes);

// const wsPort = parseInt(process.env.WEBSOCKET_PORT ?? "9090");

app
  .listen({ port }, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);

    const server = createServer(app);
    const wss = new WebSocket.Server({ server });

    wss.on("connection", function connection(ws) {
      ws.send("Hello response");
      ws.on("error", console.error);

      ws.on("message", function message(data) {
        console.log("received: %s", data);
      });

      ws.send("something");
    });
  })
  .on("error", (err) => {
    console.log(err);
    process.exit(1);
  });

console.log("end");
