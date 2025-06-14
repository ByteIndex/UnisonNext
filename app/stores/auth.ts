import { Session } from "@supabase/supabase-js";

import { createClient } from "@/services/supabase/client";

import { createPersistStore } from "./base";

let fetchState = false;

const DEFAULT_ACCESS_STATE = {
  session: null as Session | null,
  sendOTPTime: null as string | null,
};

export interface AuthState {
  session: Session | null;
  sendOTPTime?: string;
}

export interface AuthAction {
  getSession(): Promise<Session | undefined>
}

export type AuthStore = AuthState & AuthAction;

export const useAuthStore = createPersistStore(
  { ...DEFAULT_ACCESS_STATE } as AuthStore,

  (set, get) => ({
    isAuthorized() {
      return !!get().session;
    },
    async fetchSession() {
      fetchState = false;
      return createClient().auth.getSession()
        .then((result) => {
          const {
            data: { session },
          } = result;
          set({ session });
          fetchState = true;
          return session;
        })
        .catch(() => {
          console.error("[Auth] failed to fetch session");
          return null;
        });
    },
    async getSession() {
      if (!fetchState) {
        await this.fetchSession();
      }

      return get().session;
    },
    updateSession(s: Session | null) {
      set(() => ({ session: s }));
    },
    setSendOTPTime() {
      set(() => ({ sendOTPTime: Date() }));
    },
    getUser() {
      return get().session?.user
    },
    getDisplayName() {
      const user = get().session?.user;

      if (user) {
        const userMetadata = user.user_metadata;
        const nameKeys = [
          "full_name",
          "name",
          "preferred_username",
          "user_name",
          "email",
        ];
        for (const key of nameKeys) {
          if (userMetadata[key]) {
            return userMetadata[key];
          }
        }

        if (user.email) {
          return user.email;
        }
      }

      return "";
    },
    getAvatarUrl() {
      const user = get().session?.user;
      return (
        user?.user_metadata["avatar_url"] ??
        "https://api.multiavatar.com/4a2b8e81f0c90ea02f.svg"
      );
    },
    clear() {
      set(() => ({ session: null }));
    },
  }),

  {
    name: "Auth",
    version: 1,
  },
);
