import { createContext, useState } from "react";

const Context = createContext({
  email: "",
  setEmail: () => {},
  password: "",
  setPassword: () => {},
  results: [],
  addResult: () => {},
});

const ContextProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [results, setResults] = useState([
    {
      id: "seed-1",
      subject: "Инженерная графика",
      date: "2024-03-12",
      user: "student.one@college.edu",
      score: 14,
      total: 20,
    },
    {
      id: "seed-2",
      subject: "Инженерная графика",
      date: "2024-03-19",
      user: "student.two@college.edu",
      score: 18,
      total: 20,
    },
  ]);

  const addResult = ({ user, score, total, subject, date }) => {
    setResults((previous) => [
      ...previous,
      {
        id: `result-${Date.now()}`,
        user,
        score,
        total,
        subject,
        date,
      },
    ]);
  };

  const values = {
    email,
    setEmail,
    password,
    setPassword,
    results,
    addResult,
  };

  return <Context.Provider value={values}>{children}</Context.Provider>;
};
export { ContextProvider, Context };
