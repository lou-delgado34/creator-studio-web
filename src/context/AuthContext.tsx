import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

type UserProfile = {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
  plan: string;
  ai_credits: number;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: string | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,name,role,plan,ai_credits")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Profile fetch error:", error.message);
    return null;
  }

  return (data as UserProfile | null) ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    const nextProfile = await fetchProfile(user.id);
    setProfile(nextProfile);
  };

  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error.message);
        }

        if (!mounted) return;

        const currentUser = currentSession?.user ?? null;
        setSession(currentSession ?? null);
        setUser(currentUser);

        if (currentUser) {
          const nextProfile = await fetchProfile(currentUser.id);
          if (!mounted) return;
          setProfile(nextProfile);
        } else {
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    boot();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      const nextUser = newSession?.user ?? null;

      setSession(newSession ?? null);
      setUser(nextUser);

      if (nextUser) {
        const nextProfile = await fetchProfile(nextUser.id);
        setProfile(nextProfile);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      profile,
      loading,
      async signUp(email: string, password: string, fullName: string) {
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
      async signIn(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        return { error: error?.message ?? null };
      },
      async signOut() {
        await supabase.auth.signOut();
      },
      refreshProfile,
    }),
    [user, session, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
