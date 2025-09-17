import { ColorScheme } from "../context/ThemeContext";

export interface ThemeContextValue {
  scheme: ColorScheme;
  toggle: () => void;
  setScheme: (s: ColorScheme) => void;
}