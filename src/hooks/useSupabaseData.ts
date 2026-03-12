import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  subjects: string[];
  class: string;
  section?: string;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  class: string;
  section?: string;
  teacher: string;
  periods_per_week: number;
  pupils: number;
  term: string;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  building: string;
  facilities: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Pupil {
  id: string;
  pupil_id: string;
  name: string;
  age: number;
  class: string;
  section?: string;
  email: string;
  status: string;
  subjects: string[];
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  id: string;
  day: string;
  start_time: string;
  end_time: string;
  subject: string;
  teacher: string;
  room: string;
  type: string;
  class?: string;
  section?: string;
  created_at: string;
  updated_at: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  time: string;
  created_at: string;
}

export interface RecentActivity {
  id: string;
  type: 'teacher' | 'pupil' | 'subject' | 'timeslot';
  action: string;
  timestamp: string;
  user?: string;
}

export interface DashboardStats {
  totalTeachers: number;
  totalSubjects: number;
  totalRooms: number;
  totalPupils: number;
  totalTimeSlots: number;
}

// ─── Teachers ─────────────────────────────────────────────────────────────────

export function useTeachers() {
  return useQuery<Teacher[]>({
    queryKey: ["teachers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.warn("Teachers fetch error, possible schema mismatch:", error.message);
        // If 'section' is missing, the error might be specific to selecting it. 
        // But since we use '*', PostgREST should ideally just omit missing columns if cache is reloaded.
        // If it still fails, we can catch it here.
        throw error;
      }
      return (data || []).map((t: any) => ({
        ...t,
        subjects: Array.isArray(t.subjects) ? t.subjects : [],
        section: t.section || 'Primary', // Default if missing or null
      }));
    },
  });
}

export function useAddTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teacher: Omit<Teacher, "id" | "created_at" | "updated_at">) => {
      try {
        const { data, error } = await supabase
          .from("teachers")
          .insert([teacher])
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (error: any) {
        const msg = error.message?.toLowerCase() || "";
        if (msg.includes("row-level security") || msg.includes("policy")) {
          console.error("RLS Violation! Please run fix_database.sql in your Supabase SQL Editor to allow mock admin access.");
          throw new Error("Database Permission Denied: Please run fix_database.sql to enable admin access.");
        }
        if ((msg.includes("column") && msg.includes("does not exist")) || msg.includes("schema cache") || msg.includes("could not find")) {
          const payload = { ...teacher } as any;
          if (msg.includes("section")) delete payload.section;
          if (msg.includes("class")) delete payload.class;
          
          console.warn("Retrying teacher insert without failing columns due to schema mismatch:", msg);
          const { data, error: retryError } = await supabase.from("teachers").insert([payload]).select().single();
          if (retryError) throw retryError;
          return data;
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Teacher> & { id: string }) => {
      try {
        const { data, error } = await supabase
          .from("teachers")
          .update(updates)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (error: any) {
        const msg = error.message?.toLowerCase() || "";
        if (msg.includes("row-level security") || msg.includes("policy")) {
          throw new Error("Database Permission Denied: Please run fix_database.sql to enable admin access.");
        }
        if ((msg.includes("column") && msg.includes("does not exist")) || msg.includes("schema cache") || msg.includes("could not find")) {
          const payload = { ...updates } as any;
          if (msg.includes("section")) delete payload.section;
          if (msg.includes("class")) delete payload.class;
          
          console.warn("Retrying teacher update without failing columns:", msg);
          const { data, error: retryError } = await supabase.from("teachers").update(payload).eq("id", id).select().single();
          if (retryError) throw retryError;
          return data;
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("teachers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
}

// ─── Subjects ─────────────────────────────────────────────────────────────────

export function useSubjects() {
  return useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.warn("Subjects fetch error, possible schema mismatch:", error.message);
        throw error;
      }
      return (data || []).map((s: any) => ({
        ...s,
        section: s.section || 'Primary',
      }));
    },
  });
}

export function useAddSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subject: Omit<Subject, "id" | "created_at" | "updated_at">) => {
      // Attempt to insert with section, but handle failure if column doesn't exist
      try {
        const { data, error } = await supabase
          .from("subjects")
          .insert([subject])
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (error: any) {
        const msg = error.message?.toLowerCase() || "";
        if (msg.includes("row-level security") || msg.includes("policy")) {
          throw new Error("Database Permission Denied: Please run fix_database.sql to enable admin access.");
        }
        if ((msg.includes("column") && msg.includes("does not exist")) || msg.includes("schema cache") || msg.includes("could not find")) {
          const payload = { ...subject } as any;
          if (msg.includes("section")) delete payload.section;
          if (msg.includes("class")) delete payload.class;
          
          console.warn("Retrying subject insert without failing columns:", msg);
          const { data, error: retryError } = await supabase
            .from("subjects")
            .insert([payload])
            .select()
            .single();
          if (retryError) throw retryError;
          return data;
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Subject> & { id: string }) => {
      try {
        const { data, error } = await supabase
          .from("subjects")
          .update(updates)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (error: any) {
        const msg = error.message?.toLowerCase() || "";
        if ((msg.includes("column") && msg.includes("does not exist")) || msg.includes("schema cache") || msg.includes("could not find")) {
          const payload = { ...updates } as any;
          if (msg.includes("section")) delete payload.section;
          if (msg.includes("class")) delete payload.class;
          
          console.warn("Retrying subject update without failing columns:", msg);
          const { data, error: retryError } = await supabase
            .from("subjects")
            .update(payload)
            .eq("id", id)
            .select()
            .single();
          if (retryError) throw retryError;
          return data;
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("subjects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

// ─── Rooms ────────────────────────────────────────────────────────────────────

export function useRooms() {
  return useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((r: any) => ({
        ...r,
        facilities: Array.isArray(r.facilities) ? r.facilities : [],
      }));
    },
  });
}

export function useAddRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (room: Omit<Room, "id" | "created_at" | "updated_at">) => {
      try {
        const { data, error } = await supabase
          .from("rooms")
          .insert([room])
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (error: any) {
        const msg = error.message?.toLowerCase() || "";
        if (msg.includes("row-level security") || msg.includes("policy")) {
          throw new Error("Database Permission Denied: Please run fix_rooms_rls.sql to enable admin access.");
        }
        if ((msg.includes("column") && msg.includes("does not exist")) || msg.includes("schema cache") || msg.includes("could not find")) {
          const payload = { ...room } as any;
          if (msg.includes("section")) delete payload.section;
          if (msg.includes("class")) delete payload.class;
          
          console.warn("Retrying room insert without failing columns:", msg);
          const { data, error: retryError } = await supabase
            .from("rooms")
            .insert([payload])
            .select()
            .single();
          if (retryError) throw retryError;
          return data;
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Room> & { id: string }) => {
      try {
        const { data, error } = await supabase
          .from("rooms")
          .update(updates)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (error: any) {
        const msg = error.message?.toLowerCase() || "";
        if (msg.includes("row-level security") || msg.includes("policy")) {
          throw new Error("Database Permission Denied: Please run fix_rooms_rls.sql to enable admin access.");
        }
        if ((msg.includes("column") && msg.includes("does not exist")) || msg.includes("schema cache") || msg.includes("could not find")) {
          const payload = { ...updates } as any;
          if (msg.includes("section")) delete payload.section;
          if (msg.includes("class")) delete payload.class;
          
          console.warn("Retrying room update without failing columns:", msg);
          const { data, error: retryError } = await supabase
            .from("rooms")
            .update(payload)
            .eq("id", id)
            .select()
            .single();
          if (retryError) throw retryError;
          return data;
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("rooms").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

// ─── Pupils ───────────────────────────────────────────────────────────────────

export function usePupils() {
  return useQuery<Pupil[]>({
    queryKey: ["pupils"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pupils")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.warn("Pupils fetch error:", error.message);
        throw error;
      }
      return (data || []).map((p: any) => ({
        ...p,
        subjects: Array.isArray(p.subjects) ? p.subjects : [],
        section: p.section || 'Primary',
      }));
    },
  });
}

export function useAddPupil() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pupil: Omit<Pupil, "id" | "created_at" | "updated_at">) => {
      try {
        const { data, error } = await supabase
          .from("pupils")
          .insert([pupil])
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (error: any) {
        const msg = error.message?.toLowerCase() || "";
        if (msg.includes("row-level security") || msg.includes("policy")) {
          throw new Error("Database Permission Denied: Please run fix_database.sql to enable admin access.");
        }
        if ((msg.includes("column") && msg.includes("does not exist")) || msg.includes("schema cache") || msg.includes("could not find")) {
          const payload = { ...pupil } as any;
          if (msg.includes("section")) delete payload.section;
          if (msg.includes("class")) delete payload.class;

          console.warn("Retrying pupil insert without failing columns:", msg);
          const { data, error: retryError } = await supabase.from("pupils").insert([payload]).select().single();
          if (retryError) throw retryError;
          return data;
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pupils"] });
    },
  });
}

export function useUpdatePupil() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Pupil> & { id: string }) => {
      try {
        const { data, error } = await supabase
          .from("pupils")
          .update(updates)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (error: any) {
        const msg = error.message?.toLowerCase() || "";
        if ((msg.includes("column") && msg.includes("does not exist")) || msg.includes("schema cache") || msg.includes("could not find")) {
          const payload = { ...updates } as any;
          if (msg.includes("section")) delete payload.section;
          if (msg.includes("class")) delete payload.class;

          console.warn("Retrying pupil update without failing columns:", msg);
          const { data, error: retryError } = await supabase
            .from("pupils")
            .update(payload)
            .eq("id", id)
            .select()
            .single();
          if (retryError) throw retryError;
          return data;
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pupils"] });
    },
  });
}

export function useDeletePupil() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pupils").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pupils"] });
    },
  });
}

// ─── Time Slots ───────────────────────────────────────────────────────────────

export function useTimeSlots() {
  return useQuery<TimeSlot[]>({
    queryKey: ["time_slots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("time_slots")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.warn("TimeSlots fetch error:", error.message);
        throw error;
      }
      return (data || []).map((slot: any) => ({
        ...slot,
        class: slot.class || 'N/A',
        section: slot.section || 'Primary',
      }));
    },
  });
}

export function useAddTimeSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slot: Omit<TimeSlot, "id" | "created_at" | "updated_at">) => {
      try {
        const { data, error } = await supabase
          .from("time_slots")
          .insert([slot])
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (error: any) {
        const msg = error.message?.toLowerCase() || "";
        if (msg.includes("row-level security") || msg.includes("policy")) {
          throw new Error("Database Permission Denied: Please run fix_database.sql to enable admin access.");
        }
        if ((msg.includes("column") && msg.includes("does not exist")) || msg.includes("schema cache") || msg.includes("could not find")) {
          const payload = { ...slot } as any;
          if (msg.includes("section")) delete payload.section;
          if (msg.includes("class")) delete payload.class;
          
          console.warn("Retrying time slot insert without failing columns:", msg);
          const { data, error: retryError } = await supabase.from("time_slots").insert([payload]).select().single();
          if (retryError) throw retryError;
          return data;
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time_slots"] });
    },
  });
}

export function useUpdateTimeSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TimeSlot> & { id: string }) => {
      try {
        const { data, error } = await supabase
          .from("time_slots")
          .update(updates)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (error: any) {
        const msg = error.message?.toLowerCase() || "";
        if ((msg.includes("column") && msg.includes("does not exist")) || msg.includes("schema cache") || msg.includes("could not find")) {
          const payload = { ...updates } as any;
          if (msg.includes("section")) delete payload.section;
          if (msg.includes("class")) delete payload.class;

          console.warn("Retrying time slot update without failing columns:", msg);
          const { data, error: retryError } = await supabase
            .from("time_slots")
            .update(payload)
            .eq("id", id)
            .select()
            .single();
          if (retryError) throw retryError;
          return data;
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time_slots"] });
    },
  });
}

export function useDeleteTimeSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("time_slots").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time_slots"] });
    },
  });
}

// ─── Today's Schedule ─────────────────────────────────────────────────────────

export function useTodaySchedule() {
  return useQuery({
    queryKey: ["today_schedule"],
    queryFn: async () => {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = days[new Date().getDay()];
      const { data, error } = await supabase
        .from("time_slots")
        .select("*, subjects:subject(*), teachers:teacher(*), rooms:room(*)")
        .eq("day", today)
        .order("start_time", { ascending: true });
      if (error) {
        // Fallback: fetch without joins if columns don't exist
        const { data: fallback, error: fallbackError } = await supabase
          .from("time_slots")
          .select("*")
          .eq("day", today)
          .order("start_time", { ascending: true });
        if (fallbackError) throw fallbackError;
        return (fallback || []).map((slot: any) => ({
          ...slot,
          subjects: { name: slot.subject },
          teachers: { name: slot.teacher },
          rooms: { name: slot.room },
        }));
      }
      return (data || []).map((slot: any) => ({
        ...slot,
        subjects: slot.subjects || { name: slot.subject },
        teachers: slot.teachers || { name: slot.teacher },
        rooms: slot.rooms || { name: slot.room },
      }));
    },
  });
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard_stats"],
    queryFn: async () => {
      const [teachers, subjects, rooms, pupils, timeSlots] = await Promise.all([
        supabase.from("teachers").select("id", { count: "exact", head: true }),
        supabase.from("subjects").select("id", { count: "exact", head: true }),
        supabase.from("rooms").select("id", { count: "exact", head: true }),
        supabase.from("pupils").select("id", { count: "exact", head: true }),
        supabase.from("time_slots").select("id", { count: "exact", head: true }),
      ]);
      // Hardcoded overrides as requested by the user
      return {
        totalTeachers: 32,
        totalSubjects: subjects.count ?? 0,
        totalRooms: 25,
        totalPupils: 450,
        totalTimeSlots: timeSlots.count ?? 0,
      };
    },
  });
}

// ─── Recent Activity ──────────────────────────────────────────────────────────

export function useRecentActivity() {
  return useQuery<RecentActivity[]>({
    queryKey: ["recent_activity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("time_slots")
        .select("id, subject, teacher, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) return [];
      return (data || []).map((item: any) => ({
        id: item.id,
        type: 'timeslot',
        action: `Scheduled ${item.subject} with ${item.teacher}`,
        timestamp: item.created_at,
        user: "System"
      }));
    },
  });
}

// ─── System Notifications ─────────────────────────────────────────────────────

export function useSystemNotifications() {
  return useQuery<SystemNotification[]>({
    queryKey: ["system_notifications"],
    queryFn: async () => {
      // Return empty array if table doesn't exist yet
      try {
        const { data, error } = await supabase
          .from("notifications" as any)
          .select("*")
          .order("created_at", { ascending: false });
        if (error) return [] as SystemNotification[];
        return (data as any[]) || [] as SystemNotification[];
      } catch {
        return [] as SystemNotification[];
      }
    },
  });
}