// components/ApolloWrapper.tsx
"use client"; // This tells Next.js to treat this file as a client component

import { ApolloProvider } from "@apollo/client";
import { ReactNode } from "react";
import client from "../../lib/graphql"; // Your Apollo client configuration

interface ApolloWrapperProps {
  children: ReactNode;
}

export default function ApolloWrapper({ children }: ApolloWrapperProps) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
