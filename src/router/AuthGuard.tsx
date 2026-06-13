import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { authApi } from "../api/auth";
import { mypageApi } from "../api/mypage";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isChecking, setIsChecking] = useState(true);
  const { accessToken, setTokens, setUserName, setUserId, clearAuth } =
    useAuthStore();
  const navigate = useNavigate();
  const hasChecked = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (hasChecked.current) return;
      hasChecked.current = true;

      if (accessToken) {
        if (!useAuthStore.getState().userName) {
          try {
            const { data } = await mypageApi.getMypage();
            setUserName(data.data.profile.name);
            setUserId(data.data.profile.id);
          } catch {
            // userName 복원 실패는 치명적이지 않으므로 무시
          }
        }
        setIsChecking(false);
        return;
      }

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        clearAuth();
        navigate("/login", { replace: true });
        return;
      }

      try {
        const { data } = await authApi.refresh({ refresh_token: refreshToken });
        setTokens(data);

        const { data: mypageData } = await mypageApi.getMypage();
        setUserName(mypageData.data.profile.name);
        setUserId(mypageData.data.profile.id);
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
