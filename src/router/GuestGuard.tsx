import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

interface GuestGuardProps {
  children: React.ReactNode;
}

export default function GuestGuard({ children }: GuestGuardProps) {
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();
  const refreshToken = localStorage.getItem("refreshToken");
  const isLoggedIn = !!accessToken || !!refreshToken;

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (isLoggedIn) return null;

  return <>{children}</>;
}
