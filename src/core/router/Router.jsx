import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../../ui/pages/loginPage/LoginPage.jsx";
import { MainPage } from "../../ui/pages/mainPage/MainPage.jsx";
import { ResultsPage } from "../../ui/pages/resultsPage/ResultsPage.jsx";
import { AdminPage } from "../../ui/pages/adminPage/AdminPage.jsx";

const routes = [
  { path: "/", element: <LoginPage /> },
  { path: "/main", element: <MainPage /> },
  { path: "/results", element: <ResultsPage /> },
  { path: "/admin", element: <AdminPage /> },
];
const router = createBrowserRouter(routes);
export default router;
