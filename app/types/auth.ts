export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  phone: string;
  password: string;
  username: string;
}

export interface UserInfo {
  nickname: string;
  avatar: string;
  level: number;
}

export interface LoginResponseData {
  userId: string;
  token: string;
  refreshToken: string;
  userInfo: UserInfo;
}

export interface LoginResponse {
  code: number;
  message: string;
  data?: {
    token: string;
    refreshToken: string;
    userInfo: {
      nickname: string;
      avatar: string;
      level: number;
    }
  };
  error?: {
    type: string;
  };
} 