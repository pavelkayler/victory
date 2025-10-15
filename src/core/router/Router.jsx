import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../../ui/pages/loginPage/LoginPage.jsx";

const routes = [{ path: "/", element: <LoginPage /> }];
const router = createBrowserRouter(routes);
export default router;
