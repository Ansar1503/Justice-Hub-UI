import { Gender } from "../enums/user.enums";
import { clientDataType } from "./Client.data.type";

export interface ResponseType {
  success: boolean;
  message: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  accesstoken: string;
  user: {
    email: string;
    name: string;
    role: string;
    user_id: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface BasicUpdatePayload {
  image?: File;
  name: string;
  mobile?: string;
  dob?: string;
  gender?: Gender;
}

export interface BasicUpdateResponse extends ResponseType {
  data: clientDataType;
}
