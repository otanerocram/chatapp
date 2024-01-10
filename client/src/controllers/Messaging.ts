import axios, { AxiosResponse } from "axios";
import { API_URL } from "../helpers/config";
import { EmailUser, MessagePayload } from "../types/user";

const getUserList = async (): Promise<Array<EmailUser>> => {
  const response = await axios.get(`${API_URL}/messaging/users`);
  const { data } = response;
  return data;
};

const getMessages = async (params: Omit<MessagePayload, "timestamp" | "message">): Promise<AxiosResponse<Array<MessagePayload>>> => {
  return axios.get(`${API_URL}/messaging/messages`, { params });
};

const sendNewChatMessage = async (payload: MessagePayload) => {
  return axios.post(`${API_URL}/messaging/message`, payload);
};

export { getUserList, sendNewChatMessage, getMessages };
