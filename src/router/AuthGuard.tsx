import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import { authApi } from "../api/auth";
import { mypageApi } from "../api/mypage";
import { mypageKeys } from "../queries/keys";
import type { MypageData } from "../types/mypage";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isChecking, setIsChecking] = useState(true);
  const { accessToken, setAccessToken, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasChecked = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (hasChecked.current) return;
      hasChecked.current = true;

      const fetchAndCheckProfile = async () => {
        const mypageData = await queryClient.fetchQuery({
          queryKey: mypageKeys.detail(),
          queryFn: async () => {
            const res = await mypageApi.getMypage();
            return res.data.data;
          },
          staleTime: 1000 * 60 * 5,
        });

        if (!(mypageData as MypageData).profile.is_profile_set) {
          navigate("/onboarding", { replace: true });
        }
      };

      if (accessToken) {
        await fetchAndCheckProfile();
        setIsChecking(false);
        return;
      }

      try {
        const { data } = await authApi.refresh();
        setAccessToken(data.access_token);

        await fetchAndCheckProfile();
      } catch {
        clearAuth();
        navigate("/login", { replace: true });
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  if (isChecking) return null;

  return <>{children}</>;
}
