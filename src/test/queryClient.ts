import { createElement, type PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const activeTestClients = new Set<QueryClient>();

export const createTestQueryClient = (): QueryClient => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  activeTestClients.add(client);
  return client;
};

export const createTestQueryWrapper = () => {
  const client = createTestQueryClient();
  const wrapper = ({ children }: PropsWithChildren) =>
    createElement(QueryClientProvider, { client }, children);

  return { client, wrapper };
};

export const clearTestQueryClients = (): void => {
  activeTestClients.forEach((client) => client.clear());
  activeTestClients.clear();
};
