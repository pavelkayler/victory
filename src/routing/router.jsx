import {createBrowserRouter, RouterProvider} from "react-router-dom";
import * as ReactDom from "react-dom/client.js";
import App from "../app/App.jsx";

const router = createBrowserRouter([{
    path: "/",
    element: <App />
}]);

ReactDom.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router}/>
);