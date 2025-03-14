import { ThemeEnum } from "../enums/theme_enum";

export type ThemeType = {
  theme: ThemeEnum;
  toggle_theme: () => void;
};
