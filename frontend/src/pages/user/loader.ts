import user from "@/api/user";
import { keepPreviousData, QueryClient } from "@tanstack/react-query";

export const queryUserList = (pagination: { skip: number; limit: number }) => ({
  queryKey: ["users", pagination],
  queryFn: () => user.getUsers(pagination),
  placeholderData: keepPreviousData,
  staleTime: 50 * 1000 * 5,
  refetchOnWindowFocus: true,
  refetchInterval: 50 * 1000 * 5,
});

export const userLoader = (queryClient: QueryClient) => async () => {
  const params = new URLSearchParams(window.location.search);
  const skip = Number(params.get("skip") as string) || 0;
  const limit = Number(params.get("limit") as string) || 10;
  return queryClient.fetchQuery(queryUserList({ skip, limit }));
};
