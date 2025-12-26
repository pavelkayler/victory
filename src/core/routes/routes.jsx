import { createHashRouter } from "react-router-dom";

import AuthPage from "../../ui/pages/authPage/AuthPage.jsx";
import QuizPage from "../../ui/pages/quizPage/QuizPage.jsx";
import ResultPage from "../../ui/pages/resultPage/ResultPage.jsx";
import HistoryPage from "../../ui/pages/historyPage/HistoryPage.jsx";
import TopicsPage from "../../ui/pages/topicsPage/TopicsPage.jsx";
import AdminPage from "../../ui/pages/adminPage/AdminPage.jsx";
import AdminTopicPage from "../../ui/pages/adminPage/AdminTopicPage.jsx";
import RatingPage from "../../ui/pages/ratingPage/RatingPage.jsx";
import FallbackRedirect from "../../ui/pages/FallbackRedirect.jsx";
import { ADMIN_PATH } from "../constants/paths.js";

const routes = createHashRouter([
  { path: "/", element: <AuthPage /> },
  { path: "/topics", element: <TopicsPage /> },   // выбор темы
  { path: "/quiz", element: <QuizPage /> },
  { path: "/result", element: <ResultPage /> },
  { path: "/history", element: <HistoryPage /> },
  { path: "/rating/:topicId", element: <RatingPage /> },
  { path: ADMIN_PATH, element: <AdminPage /> },
  { path: `${ADMIN_PATH}/topics/:topicId`, element: <AdminTopicPage /> },
  { path: "*", element: <FallbackRedirect /> },
]);

export { routes };
