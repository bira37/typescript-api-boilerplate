export interface UserLogin {
  username: string;
  password: string;
}

export interface UserLoginReturn {
  token: string;
  sessionId: string;
}

export interface TokenPayload {
  userId: string;
}
