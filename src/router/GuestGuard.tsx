import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

interface GuestGuardProps {
  children: React.ReactNode;
}

export default function GuestGuard({ children }: GuestGuardProps) {
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();
  const isLoggedIn = !!accessToken;

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (isLoggedIn) return null;

  return <>{children}</>;
}
