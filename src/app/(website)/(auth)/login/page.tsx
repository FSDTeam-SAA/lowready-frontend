import LoginForm from "@/components/auth/LoginForm";
import React, { Suspense } from "react";

const page = () => {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
};

export default page;
