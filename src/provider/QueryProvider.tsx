"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import AuthProvider from "./session-procider";
import { SessionProvider } from "next-auth/react";

interface TanstackProviderProps {
  children: React.ReactNode;
}

const TanstackProvider = ({ children }: TanstackProviderProps) => {
  const [queryclient] = useState(() => new QueryClient());
  return (
    <SessionProvider>
    <QueryClientProvider client={queryclient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
    </SessionProvider>
  );
};

export default TanstackProvider;
