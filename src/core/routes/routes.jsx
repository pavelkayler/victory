import { createHashRouter } from "react-router-dom";

import AuthPage from "../../ui/pages/authPage/AuthPage.jsx";
import QuizPage from "../../ui/pages/quizPage/QuizPage.jsx";
import ResultPage from "../../ui/pages/resultPage/ResultPage.jsx";
import HistoryPage from "../../ui/pages/historyPage/HistoryPage.jsx";
import TopicsPage from "../../ui/pages/topicsPage/TopicsPage.jsx";
import AdminPage from "../../ui/pages/adminPage/AdminPage.jsx";
import AdminTopicPage from "../../ui/pages/adminPage/AdminTopicPage.jsx";
import FallbackRedirect from "../../ui/pages/FallbackRedirect.jsx";

const routes = createHashRouter([
  { path: "/", element: <AuthPage /> },
  { path: "/topics", element: <TopicsPage /> },   // выбор темы
  { path: "/quiz", element: <QuizPage /> },
  { path: "/result", element: <ResultPage /> },
  { path: "/history", element: <HistoryPage /> },
  { path: "/qques", element: <AdminPage /> },
  { path: "/qques/topics/:topicId", element: <AdminTopicPage /> },
  { path: "*", element: <FallbackRedirect /> },
]);

export { routes };
