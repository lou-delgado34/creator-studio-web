import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { AppProfile } from "../lib/appTypes";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  profile: AppProfile | null;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const demoAdminProfile: AppProfile = {
  id: "demo-admin",
  email: "admin@creatorstudio.app",
  full_name: "Admin User",
  role: "admin",
  plan: "admin_unlimited",
  ai_credits: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      const useDemo = localStorage.getItem("creatorstudio_demo_auth");
      if (useDemo === "true") {
        setSession({} as Session);
        setProfile(demoAdminProfile);
      }
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session ?? null);

      if (data.session?.user) {
        const { data: profileRow } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.session.user.id)
          .single();

        if (profileRow) {
          setProfile(profileRow as AppProfile);
        }
      }

      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);

      if (newSession?.user) {
        const { data: profileRow } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", newSession.user.id)
          .single();

        setProfile((profileRow as AppProfile) ?? null);
      } else {
        setProfile(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      session,
      loading,
      profile,
      async signUp(email, password, fullName) {
        if (!supabase) {
          localStorage.setItem("creatorstudio_demo_auth", "true");
          setSession({} as Session);
          setProfile({
            ...demoAdminProfile,
            email,
            full_name: fullName,
          });
          return { error: null };
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        return { error: error?.message ?? null };
      },
      async signIn(email, password) {
        if (!supabase) {
          localStorage.setItem("creatorstudio_demo_auth", "true");
          setSession({} as Session);
          setProfile({
            ...demoAdminProfile,
            email,
          });
          return { error: null };
        }

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        return { error: error?.message ?? null };
      },
      async signOut() {
        if (!supabase) {
          localStorage.removeItem("creatorstudio_demo_auth");
          setSession(null);
          setProfile(null);
          return;
        }

        await supabase.auth.signOut();
      },
    }),
    [session, loading, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
