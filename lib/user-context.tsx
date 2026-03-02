"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Fetch player profile
          const { data: playerData } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();

          if (playerData) {
            setPlayer(playerData as Player);
          }
        }
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        const { data: playerData } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (playerData) {
          setPlayer(playerData as Player);
        }
      } else {
        setPlayer(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const updatePlayer = async (updates: Partial<Player>) => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();

      if (data) {
        setPlayer(data as Player);
      }
    } catch (error) {
      console.error("Error updating player:", error);
    }
  };

  const logout = async () => {
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
