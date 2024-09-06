import api from "@/utils/request";

const TOKEN_URL = "/service/token";
const REFRESH_TOKEN_URL = "/service/refresh";
const LOGOUT_URL = "/service/logout";
const CURRENT_ACCOUNT_URL = "/service/current-account";
const login = async (
  formData: FormData
): Promise<{ access_token: string; refresh_token: string }> => {
  const { data } = await api.postForm<{
    access_token: string;
    refresh_token: string;
  }>(TOKEN_URL, formData);
  return data;
};

const logout = async (access_token: string, refresh_token: string) => {
  await api.put(LOGOUT_URL, { access_token, refresh_token });
};
const refresh = async (access_token: string) => {
  const { data } = await api.post(REFRESH_TOKEN_URL, { access_token });
  return data;
};
const get_current_account = async () => {
  const { data } = await api.get(CURRENT_ACCOUNT_URL);
  return data;
};

export default {
  login,
  logout,
  refresh,
  get_current_account,
};
