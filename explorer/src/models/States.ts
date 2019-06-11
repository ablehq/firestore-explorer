export type ThemeMode = "dark" | "light";
export interface ThemeState {
  mode: ThemeMode;
}

export interface RootState {
  version: string;
  theme: ThemeState;
}
