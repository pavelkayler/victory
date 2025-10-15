import {RouterProvider} from "react-router-dom";
import router from "../../core/router/Router.jsx";
import {ContextProvider} from "../../core/context/Context.jsx";

function App() {
        return (
            <ContextProvider>
                <RouterProvider router={router}/>
            </ContextProvider>
                )
    }

export default App