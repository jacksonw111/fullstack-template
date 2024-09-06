import api from "@/utils/request";
interface CurrentUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  permissions: string[];
}
const BASE_URL = "/service/current-account";
const getCurrentUser = async () => {
  const { data } = await api.get<CurrentUser>(`${BASE_URL}`);
  return data;
};

export default { getCurrentUser };
