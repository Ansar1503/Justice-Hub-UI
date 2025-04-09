import { Gender, UserEnum } from "../enums/user.enums";

export type userDataType = {
  user_id?: string;
  name: string;
  email: string;
  mobile?: string;
  password?: string;
  role?: UserEnum;
  is_verified: boolean;
  is_blocked: boolean;
};

export type clientDataType = {
  user_id?: string;
  name: string;
  email: string;
  mobile?: string;
  password?: string;
  image?: string;
  is_verified?: boolean;
  dob?: string;
  address?: AddressType;
  role?: UserEnum;
  gender?: Gender;
  is_blocked?: boolean;
  created_at?: Date;
  updated_at?: Date;
};

export type AddressType = {
  state?: string;
  city?: string;
  locality?: string;
  pincode?: string;
};
