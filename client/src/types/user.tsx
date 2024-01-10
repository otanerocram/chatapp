import { LoginForm } from "./login";

export type RegisterForm = LoginForm & {
  passwordConfirmation?: string;
  nickname?: string;
};

export type RegisterResponse = UserInfo & {
  message?: string;
};

export type EmailUser = {
  nickname: string;
  email: string;
};

export type MessagePayload = {
  from: string;
  to: string;
  message: string;
  timestamp: number;
};

export type UserInfo = Omit<RegisterForm, "password">;
