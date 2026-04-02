import ForgotPasswordForm from "@/components/modules/auth/forgotPasswordForm/ForgotPasswordForm";
import { Suspense } from "react";

const page = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
};

export default page;
