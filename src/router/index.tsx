import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import SignupVerifyPage from '../pages/SignupVerifyPage';
import SignupCompletePage from '../pages/SignupCompletePage';
import OnboardingPage from '../pages/OnboardingPage';
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';
import KeywordMapPage from '../pages/KeywordMapPage';
import SavedPage from '../pages/SavedPage';
import MyPage from '../pages/MyPage';
import PaperDetailPage from '../pages/PaperDetailPage';
import KeywordMapEditPage from '../pages/KeywordMapEditPage';
import BookmarkFolderDetailPage from '../pages/BookmarkFolderDetailPage';
import RecentPaperFullscreenPage from '../pages/RecentPaperFullscreenPage';

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/signup/verify', element: <SignupVerifyPage /> },
  { path: '/signup/complete', element: <SignupCompletePage /> },
  { path: '/onboarding', element: <OnboardingPage /> },
  { path: '/home', element: <HomePage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/keyword-map', element: <KeywordMapPage /> },
  { path: '/keyword-map/edit', element: <KeywordMapEditPage /> },
  { path: '/saved', element: <SavedPage /> },
  { path: '/mypage', element: <MyPage /> },
  { path: '/papers/:id', element: <PaperDetailPage /> },
  { path: '/saved/bookmark/:folderId', element: <BookmarkFolderDetailPage /> },
  { path: '/saved/recent/fullscreen', element: <RecentPaperFullscreenPage /> },
]);

export default router;