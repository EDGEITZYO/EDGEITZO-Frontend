import { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useAuthStore } from "../stores/authStore";
import { authApi } from "../api/auth";
import LandingHeader from "../components/landing/LandingHeader";
import LandingSection1 from "../components/landing/LandingSection1";
import LandingSection2 from "../components/landing/LandingSection2";
import LandingSection3 from "../components/landing/LandingSection3";
import LandingSection4 from "../components/landing/LandingSection4";
import LandingLastSection from "../components/landing/LandingLastSection";

const useFadeIn = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pendingRefs = useRef<HTMLElement[]>([]);

  const registerRef = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    el.classList.add("fade-in-target");
    if (observerRef.current) {
      observerRef.current.observe(el);
    } else {
      pendingRefs.current.push(el);
    }
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-visible");
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    pendingRefs.current.forEach((el) => {
      observerRef.current?.observe(el);
    });
    pendingRefs.current = [];

    return () => observerRef.current?.disconnect();
  }, []);

  return { registerRef };
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const { registerRef } = useFadeIn();

  const handleGuestLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { data } = await authApi.guestLogin();
      setAccessToken(data.data.access_token);
      navigate("/home", { replace: true });
    } catch {
      // 추후 에러 처리
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0A0A0D",
        "& .fade-in-target": {
          opacity: 0,
          transform: "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        },
        "& .fade-in-visible": {
          opacity: 1,
          transform: "translateY(0)",
        },
      }}
    >
      <LandingHeader onGuestLogin={handleGuestLogin} isLoading={isLoading} />
      <LandingSection1
        onGuestLogin={handleGuestLogin}
        isLoading={isLoading}
        registerRef={registerRef}
      />
      <LandingSection2 registerRef={registerRef} />
      <LandingSection3 registerRef={registerRef} />
      <LandingSection4 registerRef={registerRef} />
      <LandingLastSection
        onGuestLogin={handleGuestLogin}
        isLoading={isLoading}
        registerRef={registerRef}
      />
    </Box>
  );
};

export default LandingPage;
