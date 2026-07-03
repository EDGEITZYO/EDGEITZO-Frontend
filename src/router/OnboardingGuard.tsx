import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import { authApi } from "../api/auth";
import { mypageApi } from "../api/mypage";
import { mypageKeys } from "../queries/keys";
import type { MypageData } from "../types/mypage";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

type SignupCompleteState =
  | { type: "email"; email: string; password: string; name: string }
  | { type: "social"; name: string }
  | null;

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { accessToken, setAccessToken } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasChecked = useRef(false);

  const state = location.state as SignupCompleteState;
  const isValidState =
    state?.type === "email"
      ? !!state.email && !!state.password
      : state?.type === "social";

  const initialCanEnter = !!accessToken || isValidState;
  const [isChecking, setIsChecking] = useState(!initialCanEnter);
  const [canEnter, setCanEnter] = useState(initialCanEnter);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    if (isValidState) return;

    const checkAccess = async () => {
      let token = accessToken;

      if (!token) {
        try {
          const { data } = await authApi.refresh();
          setAccessToken(data.access_token);
          token = data.access_token;
        } catch {
          navigate("/signup", { replace: true });
          return;
        }
      }

      try {
        const mypageData = await queryClient.fetchQuery<MypageData>({
          queryKey: mypageKeys.detail(),
          queryFn: async () => {
            const res = await mypageApi.getMypage();
            return res.data.data;
          },
          staleTime: 1000 * 60 * 5,
        });

        if (mypageData.profile.is_profile_set) {
          navigate("/home", { replace: true });
          return;
        }
      } catch {
        // mypage 조회 실패 시 통과
      }

      setCanEnter(true);
      setIsChecking(false);
    };

    checkAccess();
  }, []);

  if (isChecking) return null;
  if (!canEnter) return null;

  return <>{children}</>;
}
