import user from "@/api/user";
import { keepPreviousData, QueryClient } from "@tanstack/react-query";

export const queryUserList = (params: URLSearchParams) => ({
  queryKey: ["users", params],
  queryFn: () => user.getUsers(params),
  placeholderData: keepPreviousData,
  staleTime: 50 * 1000 * 5,
  refetchOnWindowFocus: true,
  refetchInterval: 50 * 1000 * 5,
});

export const userLoader = (queryClient: QueryClient) => async () => {
  const params = new URLSearchParams(window.location.search);
  return queryClient.fetchQuery(queryUserList(params));
};
