import { Request, Response } from "express";
import { myCache } from "..";

type UserInfo = {
  nickname?: string;
  email?: string;
  password?: string;
};

const register = (req: Request, res: Response) => {
  const { nickname, email, password } = req.body;

  if (!nickname || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  myCache.set(email, {
    nickname,
    email,
    password,
  });

  return res.status(200).send({ nickname });
};

const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userInfo: UserInfo = myCache.get(email) ?? {};

  if (!userInfo.email) {
    return res.status(200).json({ message: "Email is not registered!" });
  }

  if (userInfo.password !== password) {
    return res.status(200).json({ message: "Wrong Password!" });
  }

  return res.status(200).send({
    nickname: userInfo.nickname,
    email: userInfo.email,
  });
};

export { register, login };
