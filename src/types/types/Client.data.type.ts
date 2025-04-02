import { UserEnum } from "../enums/user.enums";

export type clientDataType = {
  user_id?: string;
  name: string;
  email: string;
  mobile?: string;
  password?: string;
  role: UserEnum;
  is_blocked?: boolean;
  created_at?: Date;
  updated_at?: Date;
};
