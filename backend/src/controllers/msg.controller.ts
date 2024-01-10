import { Request, Response } from "express";
import { myCache } from "..";

const getConnectedUsers = (req: Request, res: Response) => {
  const allKeys = myCache.keys();
  const allUsers = myCache.mget(allKeys);
  return res.status(200).send(allUsers);
};

const getUserMessages = (req: Request, res: Response) => {
  const { from, to } = req.query;
  const chats = myCache.get("chats") ?? [];

  if (!Array.isArray(chats)) {
    return [];
  }

  const filteredMessages = chats.filter((message) => message.to === to || message.to === from || message.from === to || message.from === from);
  return res.status(200).send(filteredMessages);
};

const sendMessage = (req: Request, res: Response) => {
  const data = req.body;
  try {
    let allChats = myCache.get("chats") ?? [];

    if (Array.isArray(allChats)) {
      allChats.push({ ...data });
    }

    myCache.set("chats", allChats);
    res.status(200).send("stored");
  } catch (error) {
    res.status(400).send("error");
  }
};

export { getConnectedUsers, getUserMessages, sendMessage };
