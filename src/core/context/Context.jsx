import { UserProvider } from "./UserContext.jsx";
import { HistoryProvider } from "./HistoryContext.jsx";
import { QuizProvider } from "./QuizContext.jsx";
import { AdminProvider } from "./AdminContext.jsx";
import { TopicsProvider } from "./TopicsContext.jsx";

import { UserContext } from "./UserContext.jsx";
import { HistoryContext } from "./HistoryContext.jsx";
import { QuizContext } from "./QuizContext.jsx";
import { AdminContext } from "./AdminContext.jsx";
import { TopicsContext } from "./TopicsContext.jsx";

const ContextProvider = ({ children }) => {
  return (
    <AdminProvider>
      <TopicsProvider>
        <UserProvider>
          <HistoryProvider>
            <QuizProvider>{children}</QuizProvider>
          </HistoryProvider>
        </UserProvider>
      </TopicsProvider>
    </AdminProvider>
  );
};

export {
  ContextProvider,
  UserContext,
  HistoryContext,
  QuizContext,
  AdminContext,
  TopicsContext,
};
