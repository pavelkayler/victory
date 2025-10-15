import { RouterProvider } from "react-router-dom";
import router from "../../core/router/Router.jsx";
import { ContextProvider } from "../../core/context/Context.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  );
}

export default App;
