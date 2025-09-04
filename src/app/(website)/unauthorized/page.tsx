import UnauthorizedPage from "@/components/ui/unauthorized-components";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnauthorizedPage />
    </Suspense>
  );
}
