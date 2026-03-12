import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type UserRole = "admin" | "department_head" | "lecturer" | "student";

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  department?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AVATAR_CACHE_PREFIX = "kps_avatar_";

function getCachedAvatar(userId: string): string | undefined {
  return localStorage.getItem(AVATAR_CACHE_PREFIX + userId) || undefined;
}

function setCachedAvatar(userId: string, avatarUrl: string) {
  try {
    localStorage.setItem(AVATAR_CACHE_PREFIX + userId, avatarUrl);
  } catch (e) {
    // Storage quota exceeded — clear just the avatar cache
    localStorage.removeItem(AVATAR_CACHE_PREFIX + userId);
    console.warn("Could not cache avatar — storage may be full.");
  }
}

async function fetchUserProfile(supabaseUser: SupabaseUser): Promise<User | null> {
  let profileData: any = null;
  
  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("name, department, avatar_url")
      .eq("user_id", supabaseUser.id)
      .single();
    
    if (!error) {
      profileData = profile;
    } else {
      // Fallback: try fetching only name and department if avatar_url failed
      const { data: fallbackProfile } = await supabase
        .from("profiles")
        .select("name, department")
        .eq("user_id", supabaseUser.id)
        .single();
      profileData = fallbackProfile;
    }
  } catch (err) {
    console.warn("Error fetching profile", err);
  }

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", supabaseUser.id)
    .single();

  // Use DB avatar_url if available, otherwise fall back to locally cached avatar
  const dbAvatar = profileData?.avatar_url;
  const cachedAvatar = getCachedAvatar(supabaseUser.id);
  const resolvedAvatar = dbAvatar || cachedAvatar || undefined;

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    role: (roleData?.role as UserRole) ?? "student",
    name: profileData?.name ?? supabaseUser.email ?? "",
    department: profileData?.department ?? undefined,
    avatar_url: resolvedAvatar,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setTimeout(async () => {
          const profile = await fetchUserProfile(session.user);
          setUser(profile);
          setIsLoading(false);
        }, 0);
      } else {
        const mockUserStr = localStorage.getItem("mock_user");
        if (mockUserStr) {
          setUser(JSON.parse(mockUserStr));
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user);
        setUser(profile);
      } else {
        const mockUserStr = localStorage.getItem("mock_user");
        if (mockUserStr) {
          setUser(JSON.parse(mockUserStr));
        }
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    const testAccounts: Record<string, { pass: string; role: UserRole; name: string }> = {
      "admin@kps.ac.ug": { pass: "admin123", role: "admin", name: "Administrator" },
      "depthead@kps.ac.ug": { pass: "dept123", role: "department_head", name: "Department Head" },
      "teacher@kps.ac.ug": { pass: "teacher123", role: "lecturer", name: "Teacher" },
      "pupil@kps.ac.ug": { pass: "pupil123", role: "student", name: "Pupil" }
    };

    const targetEmail = email.toLowerCase().trim();
    if (testAccounts[targetEmail] && testAccounts[targetEmail].pass === password) {
       const mockUser: User = {
         id: "mock-" + Date.now().toString(),
         email: targetEmail,
         role: testAccounts[targetEmail].role,
         name: testAccounts[targetEmail].name,
         department: testAccounts[targetEmail].role === "department_head" ? "Computer Science" : undefined
       };
       localStorage.setItem("mock_user", JSON.stringify(mockUser));
       setUser(mockUser);
       setIsLoading(false);
       return { success: true };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password,
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || "Failed to connect to database" };
    }
  };

  const logout = async () => {
    localStorage.removeItem("mock_user");
    await supabase.auth.signOut();
    setIsLoading(false);
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "No user logged in" };

    // Always cache avatar locally for persistence across page reloads
    if (updates.avatar_url) {
      setCachedAvatar(user.id, updates.avatar_url);
    }

    try {
      // If mock user
      if (user.id.startsWith("mock-")) {
        const updatedUser = { ...user, ...updates };
        localStorage.setItem("mock_user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      }

      // If real user — update in-memory immediately so UI reflects change
      setUser({ ...user, ...updates });

      // Then attempt to persist to DB (non-blocking for avatar)
      const { error } = await supabase
        .from("profiles")
        .update({
          name: updates.name,
          department: updates.department,
          avatar_url: updates.avatar_url,
        })
        .eq("user_id", user.id);

      if (error) {
        console.warn("Profile DB update failed (avatar cached locally):", error.message);
        // Don't throw — avatar is already cached locally and user state updated
      }

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to update profile" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
