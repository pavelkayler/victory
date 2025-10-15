import { createContext, useState } from "react";

const Context = createContext({});
const ContextProvider = ({ children }) => {
  const { email, setEmail } = useState([]);
  const { password, setPassword } = useState([]);

  const values = {
    email,
    setEmail,
    password,
    setPassword,
  };
  return <Context.Provider value={values}>{children}</Context.Provider>;
};
export { ContextProvider, Context };
