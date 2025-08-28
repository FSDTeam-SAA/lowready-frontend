import ForgetOptForm from "@/components/auth/ForgetOptForm";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ForgetOptForm />
      </Suspense>
    </div>
  );
};

export default page;
