export interface UserSchema {
  name: string;
  gender: string;
  email: string;
  password: string;
  current_role_id: string;
}

export interface UserCreate extends UserSchema {}

export interface UserUpdate {
  name?: string;
  email?: string;
  password?: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export const validateUserSchema = (user: UserSchema): boolean => {
  const nameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (
    nameRegex.test(user.name) &&
    emailRegex.test(user.email) &&
    user.password.length >= 8
  );
};

import api from "@/utils/request";

const BASE_URL = "/service/users";

const createUser = async (userData: UserCreate): Promise<UserResponse> => {
  const { data } = await api.post<UserResponse>(BASE_URL, userData);
  return data;
};

const getUsers = async (
  params: URLSearchParams
): Promise<{ total: number; users: UserResponse[] }> => {
  // const skip = params.get("skip") ? Number(params.get("skip")) : 0;
  // const limit = params.get("limit") ? Number(params.get("limit")) : 10;
  const { data } = await api.get<{ total: number; users: UserResponse[] }>(
    BASE_URL,
    {
      params,
    }
  );
  return data;
};

const getUser = async (userId: string): Promise<UserResponse> => {
  const { data } = await api.get<UserResponse>(`${BASE_URL}/${userId}`);
  return data;
};

const updateUser = async (
  userId: string,
  userData: UserUpdate
): Promise<UserResponse> => {
  const { data } = await api.put<UserResponse>(
    `${BASE_URL}/${userId}`,
    userData
  );
  return data;
};

const deleteUser = async (userId: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${userId}`);
};

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
