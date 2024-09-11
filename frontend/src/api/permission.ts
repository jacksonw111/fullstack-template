import api from "@/utils/request";

export interface Permission {
  id: string;
  name: string;
}

export interface RolePermissionRequest {
  role_id: string;
  permission_id: string;
}

export interface RolePermissionResponse {
  id: string;
  role_id: string;
  permission_id: string;
}

const BASE_URL = "/service/permissions";

export const getPermissions = () =>
  api.get<Permission[]>(BASE_URL);

export const createRolePermission = (rolePermission: RolePermissionRequest) =>
  api.post<RolePermissionResponse>(BASE_URL, rolePermission);

export const removeRolePermission = (id: string) =>
  api.delete(`${BASE_URL}/${id}`);
