import { UserEnum } from "../enums/user.enums";

export type AuthContextType = {
  userRole: UserEnum;
  setUserRole: (role: UserEnum) => void;
}
