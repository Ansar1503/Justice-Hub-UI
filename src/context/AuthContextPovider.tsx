import { createContext, ReactNode, useState } from "react";
import type { AuthContextType } from "../types/types/AuthContext.type";
import { UserEnum } from "../types/enums/user.enums";

export const AuthContext = createContext<AuthContextType>({
  setUserRole:()=>{},
  userRole:UserEnum.client
});

function AuthContextProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserEnum>(UserEnum.client);
  return (
    <AuthContext.Provider
      value={{ userRole, setUserRole }}
    >{children}</AuthContext.Provider>
  );
}

export default AuthContextProvider;
