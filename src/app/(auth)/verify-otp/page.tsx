import VerifyOtpForm from "@/components/modules/auth/verify-otp/VerifyOtpForm";
import { Suspense } from "react";

const page = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyOtpForm />
      </Suspense>
    </div>
  );
};

export default page;
