export interface IUserInfo {
  username: string;
  password: string;
  role: string;
}

export interface IUserSignUp {
  full_name: string;
  email: string;
  phone_number: string;
  confirm_password: string;
  password: string;
  gender: string;
  role: string;
}

export interface INewPassword {
  account: string;
  newPassword: string;
}

export interface LoginResponse {
  tokens: {
    access_token: string;
    refresh_token: string;
  };
  full_name: string;
}
