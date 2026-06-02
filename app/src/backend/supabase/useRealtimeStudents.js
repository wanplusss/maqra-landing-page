import { useEffect } from "react";
import { IS_SUPABASE_CONFIGURED } from "./config.js";
import { supabaseAdapter } from "./supabaseAdapter.js";

export function useRealtimeStudents(onUpdate) {
  useEffect(() => {
    if (!IS_SUPABASE_CONFIGURED) return;

    const channel = supabaseAdapter.subscribeToStudents(onUpdate);
    return () => supabaseAdapter.unsubscribeFromStudents(channel);
  }, [onUpdate]);
}
