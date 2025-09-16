"use client";
import { useEffect, useState, useCallback } from "react";
import { User } from "@/types";
import useApi from "./useApi";

export default function useAuth() {
  const { get } = useApi();
  const [ user, setUser ] = useState<User | null>(null);
  const [ loading, setLoading ] = useState(true);

  const fetchMe = useCallback(async () => {
    setLoading(true);
    try {
      const res = await get<User | null>(`/users/me`);
      setUser(res);
      return res;
    } catch (e) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return { user, loading, refresh: fetchMe, setUser };
}
