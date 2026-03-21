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
import type { AppProfile } from "../lib/appTypes";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: AppProfile | null;
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function ensureProfile(user: User) {
  if (!supabase) return null;

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    null;

  const email = user.email ?? "";

  const { data: existingProfile, error: selectError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (selectError) {
    console.error("Error loading profile:", selectError.message);
    return null;
  }

  if (existingProfile) {
    return existingProfile as AppProfile;
  }

  const newProfile: AppProfile = {
    id: user.id,
    email,
    full_name: fullName,
    role: "user",
    plan: "free",
    ai_credits: 10,
  };

  const { data: insertedProfile, error: insertError } = await supabase
    .from("profiles")
    .insert(newProfile)
    .select()
    .single();

  if (insertError) {
    console.error("Error creating profile:", insertError.message);
    return null;
  }

  return insertedProfile as AppProfile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialSession() {
      if (!supabase) {
        setUser(null);
        setSession(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error.message);
      }

      const currentSession = data.session ?? null;
      const currentUser = currentSession?.user ?? null;

      if (!isMounted) return;

      setSession(currentSession);
      setUser(currentUser);

      if (currentUser) {
        const currentProfile = await ensureProfile(currentUser);
        if (!isMounted) return;
        setProfile(currentProfile);
      } else {
        setProfile(null);
      }

      if (isMounted) {
        setLoading(false);
      }
    }

    loadInitialSession();

    if (!supabase) return;

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        const newUser = newSession?.user ?? null;

        setSession(newSession ?? null);
        setUser(newUser);

        if (newUser) {
          const newProfile = await ensureProfile(newUser);
          if (!isMounted) return;
          setProfile(newProfile);
        } else {
          setProfile(null);
        }

        if (isMounted) {
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      profile,
      loading,
      async signUp(email: string, password: string, fullName: string) {
        if (!supabase) {
          return { error: "Supabase is not connected yet." };
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
      async signIn(email: string, password: string) {
        if (!supabase) {
          return { error: "Supabase is not connected yet." };
        }

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        return { error: error?.message ?? null };
      },
      async signOut() {
        if (!supabase) return;
        await supabase.auth.signOut();
      },
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
