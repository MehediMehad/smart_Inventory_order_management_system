import { Suspense } from "react";
import LoginForm from "@/components/modules/auth/login/LoginForm";

const LoginPage = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
};

export default LoginPage;
