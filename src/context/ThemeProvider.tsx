import { createContext, ReactNode, useEffect, useState } from "react";
import { ThemeType } from "../types/types/ThemeConext.type";
import { ThemeEnum } from "../types/enums/theme_enum";

export const ThemeContext = createContext<ThemeType>({
  theme: ThemeEnum.Light,
  toggle_theme: () => {},
});

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeEnum>(
    (localStorage.getItem("theme") as ThemeEnum) || ThemeEnum.Light
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === ThemeEnum.Dark);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle_theme = () => {
    setTheme((prevtheme) =>
      prevtheme === ThemeEnum.Light ? ThemeEnum.Dark : ThemeEnum.Light
    );
  };
  return (
    <ThemeContext.Provider value={{ theme, toggle_theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
