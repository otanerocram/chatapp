export type LoginForm = {
  email?: string;
  password?: string;
};

export type LoginResponse = LoginForm & {
  nickname?: string;
  email?: string;
  message?: string;
};
