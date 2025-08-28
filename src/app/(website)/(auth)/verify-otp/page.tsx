import VerifyEmail from "@/components/auth/otp";
import React, { Suspense } from "react";

const page = () => {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmail />
      </Suspense>
    </main>
  );
};

export default page;
