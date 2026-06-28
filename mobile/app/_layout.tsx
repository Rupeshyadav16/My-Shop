import { Stack } from "expo-router";
import "../global.css";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

const CLERK_PUBLISHABLE_KEY = "pk_test_dG9wLWRvYmVybWFuLTk1LmNsZXJrLmFjY291bnRzLmRldiQ";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any, query) => {
      console.error("React Query Error:", error.message, query.queryKey);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      console.error("React Query Mutation Error:", error.message);
    },
  }),
});

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </ClerkProvider>
  );
}