import { AuthScreen } from "../../screens/AuthScreen.jsx";
import { UserLayout } from "../../layouts/UserLayout.jsx";

const AuthPage = () => {
  return (
    <UserLayout>
      <AuthScreen />
    </UserLayout>
  );
};

export default AuthPage;
