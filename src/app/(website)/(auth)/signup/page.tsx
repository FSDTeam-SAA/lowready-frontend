import SingupForm from "@/components/auth/singup-form";
import React, { Suspense } from "react";

const page = () => {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <SingupForm />
      </Suspense>
    </main>
  );
};

export default page;
