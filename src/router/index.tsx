import { createBrowserRouter } from "react-router-dom";
import AuthGuard from "./AuthGuard";
import GuestGuard from "./GuestGuard";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import SignupVerifyPage from "../pages/SignupVerifyPage";
import SignupCompletePage from "../pages/SignupCompletePage";
import OnboardingPage from "../pages/OnboardingPage";
import HomePage from "../pages/HomePage";
import SearchPage from "../pages/SearchPage";
import KeywordMapPage from "../pages/KeywordMapPage";
import SavedPage from "../pages/SavedPage";
import MyPage from "../pages/MyPage";
import PaperDetailPage from "../pages/PaperDetailPage";
import KeywordMapEditPage from "../pages/KeywordMapEditPage";
import BookmarkFolderDetailPage from "../pages/BookmarkFolderDetailPage";
import RecentPaperFullscreenPage from "../pages/RecentPaperFullscreenPage";
import MyPageEditPage from "../pages/MyPageEditPage";

const router = createBrowserRouter([
  // 랜딩 (별도 처리 - LandingPage 내부에서 /auth/start 호출)
  { path: "/", element: <LandingPage /> },

  // 공개 경로 (로그인 상태면 /home으로)
  {
    path: "/login",
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  {
    path: "/signup",
    element: (
      <GuestGuard>
        <SignupPage />
      </GuestGuard>
    ),
  },
  {
    path: "/signup/verify",
    element: (
      <GuestGuard>
        <SignupVerifyPage />
      </GuestGuard>
    ),
  },
  {
    path: "/signup/complete",
    element: (
      <GuestGuard>
        <SignupCompletePage />
      </GuestGuard>
    ),
  },

  // 온보딩 (토큰은 있지만 프로필 미설정 - 가드 없음)
  { path: "/onboarding", element: <OnboardingPage /> },

  // 보호된 경로
  {
    path: "/home",
    element: (
      <AuthGuard>
        <HomePage />
      </AuthGuard>
    ),
  },
  {
    path: "/search",
    element: (
      <AuthGuard>
        <SearchPage />
      </AuthGuard>
    ),
  },
  {
    path: "/keyword-map",
    element: (
      <AuthGuard>
        <KeywordMapPage />
      </AuthGuard>
    ),
  },
  {
    path: "/keyword-map/edit",
    element: (
      <AuthGuard>
        <KeywordMapEditPage />
      </AuthGuard>
    ),
  },
  {
    path: "/saved",
    element: (
      <AuthGuard>
        <SavedPage />
      </AuthGuard>
    ),
  },
  {
    path: "/mypage",
    element: (
      <AuthGuard>
        <MyPage />
      </AuthGuard>
    ),
  },
  {
    path: "/papers/:id",
    element: (
      <AuthGuard>
        <PaperDetailPage />
      </AuthGuard>
    ),
  },
  {
    path: "/saved/bookmark/:folderId",
    element: (
      <AuthGuard>
        <BookmarkFolderDetailPage />
      </AuthGuard>
    ),
  },
  {
    path: "/saved/recent/fullscreen",
    element: (
      <AuthGuard>
        <RecentPaperFullscreenPage />
      </AuthGuard>
    ),
  },
  {
    path: "/mypage/edit",
    element: (
      <AuthGuard>
        <MyPageEditPage />
      </AuthGuard>
    ),
  },
]);

export default router;
