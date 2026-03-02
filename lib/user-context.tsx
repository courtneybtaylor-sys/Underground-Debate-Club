"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { Player } from "@/lib/types";

interface UserContextType {
  user: User | null;
  player: Player | null;
  loading: boolean;
  updatePlayer: (updates: Partial<Player>) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    // Lazy load Supabase client
    const initSupabase = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const client = createClient();
        setSupabase(client);

        // Check for existing user
        const {
          data: { user },
        } = await client.auth.getUser();
        setUser(user);

        if (user) {
          // Fetch player profile
          const { data: playerData } = await client
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single()
            .catch(() => ({ data: null }));

          if (playerData) {
            setPlayer(playerData as Player);
          }
        }
      } catch (error) {
        console.log("Supabase not configured yet");
      } finally {
        setLoading(false);
      }
    };

    initSupabase();
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      setUser(session?.user || null);
      if (session?.user) {
        try {
          const { data: playerData } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single()
            .catch(() => ({ data: null }));
          if (playerData) {
            setPlayer(playerData as Player);
          }
        } catch (error) {
          console.log("Error fetching player:", error);
        }
      } else {
        setPlayer(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, [supabase]);

  const updatePlayer = async (updates: Partial<Player>) => {
    if (!user || !supabase) return;

    try {
      const { data } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single()
        .catch(() => ({ data: null }));

      if (data) {
        setPlayer(data as Player);
      }
    } catch (error) {
      console.error("Error updating player:", error);
    }
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setPlayer(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        player,
        loading,
        updatePlayer,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
