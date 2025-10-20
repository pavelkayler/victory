import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../../ui/pages/loginPage/LoginPage.jsx";
import { MainPage } from "../../ui/pages/mainPage/MainPage.jsx";

const routes = [
  { path: "/", element: <LoginPage /> },
  { path: "/main", element: <MainPage /> },
];
const router = createBrowserRouter(routes);
export default router;
