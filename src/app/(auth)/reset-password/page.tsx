import ResetPasswordForm from "@/components/modules/auth/resetPasswordForm/ResetPasswordForm";
import { Suspense } from "react";

const page = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default page;
