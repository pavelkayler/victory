import {createContext, useState} from "react";

const Context = createContext({});
const ContextProvider = ({ children }) => {
    // const [questions, setQuestions] = useState([]);

    const values = {
        // questions,
        // setQuestions,
    }
    return <Context.Provider value={values}>{children}</Context.Provider>
}
export { ContextProvider, Context };