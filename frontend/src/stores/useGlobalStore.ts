import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
interface CurrentUser {
  name: string;
  email: string;
  gender: string;
  current_role: string;
  last_login_at?: Date;
  last_login_ip?: string;
  last_active_at?: Date;
  status: string;
  initialized_at?: Date;
  permissions?: string[];
}

interface State {
  access_token: string | undefined;
  refresh_token: string | undefined;
  sidebar_collapse: boolean;
  current_user: CurrentUser | undefined;
}

interface Action {
  setAccessToken: (lang: State["access_token"]) => void;
  setRefreshToken: (lang: State["refresh_token"]) => void;
  clean: () => void;
  toggleCollapsed: () => void;
}

export const useGlobalStore = create<State & Action>()(
  devtools(
    persist(
      (set) => {
        return {
          sidebar_collapse: false,
          access_token: undefined,
          refresh_token: undefined,
          current_user: undefined,
          clean: () =>
            set({ access_token: undefined, refresh_token: undefined }),
          setAccessToken: (access_token: State["access_token"]) =>
            set({
              access_token,
            }),
          setRefreshToken: (refresh_token: State["refresh_token"]) =>
            set({
              refresh_token,
            }),
          toggleCollapsed() {
            set((state) => ({
              sidebar_collapse: !state.sidebar_collapse,
            }));
          },
        };
      },
      {
        name: "globalStore",
        storage: createJSONStorage(() => localStorage),
      }
    ),
    { name: "globalStore" }
  )
);
