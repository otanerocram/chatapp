import express, { Express } from "express";
import { login, register } from "../controllers/auth.controller";

const route: Express = express();

route.post("/register", register);
route.post("/login", login);

export { route as authRoutes }