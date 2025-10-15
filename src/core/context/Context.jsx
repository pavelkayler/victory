import { createContext, useState } from "react";

const Context = createContext({});
const ContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [questions, setQuestions] = useState([]);

  const values = {
    user,
    setUser,
    questions,
    setQuestions,
  };
  return <Context.Provider value={values}>{children}</Context.Provider>;
};
export { ContextProvider, Context };
