export interface RoleBase {
  name: string;
  permissions: string[];
}

export interface RoleCreate extends RoleBase {}

export interface RoleUpdate extends RoleBase {}

export interface RoleResponse extends RoleBase {
  id: string;
}

import api from "@/utils/request";

export interface RoleListParams {
  skip?: number;
  limit?: number;
}

export interface RoleListResponse {
  total: number;
  items: RoleResponse[];
}

const BASE_URL = "/service/roles";
export const createRole = (role: RoleCreate) =>
  api.post<RoleResponse>(BASE_URL, role);

export const getRole = (roleId: string) =>
  api.get<RoleResponse>(`${BASE_URL}/${roleId}`);

export const listRoles = (params: RoleListParams = {}) =>
  api.get<RoleListResponse>(BASE_URL, { params });

export const updateRole = (roleId: string, role: RoleUpdate) =>
  api.put<RoleResponse>(`${BASE_URL}/${roleId}`, role);

export const deleteRole = (roleId: string) =>
  api.delete(`${BASE_URL}/${roleId}`);
