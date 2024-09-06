/**
 * axios 封装
 */

import { REFRESH_TOKEN_URL } from "@/service";
import { useGlobalStore } from "@/stores/useGlobalStore";
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// 创建axios实例
const api: AxiosInstance = axios.create({
  timeout: 50000,
});

export interface ErrorResponse<T = unknown> {
  response: {
    data: T;
  };
}

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

// 请求拦截器
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    // 例如：添加token
    const { access_token } = useGlobalStore.getState();

    if (access_token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${access_token}`;
    }
    return config;
  },
  (error: unknown) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  <T>(response: AxiosResponse<T>): T | Promise<T> => {
    // 对响应数据做点什么
    return response;
  },

  async (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response;
      if (status === 401) {
        // access_token 过期，尝试使用 refresh_token
        // const refreshToken = localStorage.getItem("refresh_token");
        const { refresh_token, setAccessToken,setRefreshToken } = useGlobalStore.getState();

        if (refresh_token) {
          try {
            const response = await axios.post(REFRESH_TOKEN_URL, {
              refresh_token: refresh_token,
            });
            const newAccessToken = response.data.access_token;
            setAccessToken(newAccessToken);

            // 使用新的 access_token 重新发送原请求
            const config = error.config;
            if (config && config.headers) {
              config.headers["Authorization"] = `Bearer ${newAccessToken}`;
              return axios(config);
            }
          } catch (refreshError) {
            // refresh_token 也过期，跳转到登录页面
            console.log("refresh_token 过期，请重新登录");
            // localStorage.removeItem("access_token");
            // localStorage.removeItem("refresh_token");
            setAccessToken(undefined)
            setRefreshToken(undefined)
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        } else {
          // 没有 refresh_token，直接跳转到登录页面
          console.log("未授权，请重新登录");
          window.location.href = "/login";
        }
      } else if (status === 403) {
        console.log("拒绝访问");
      } else if (status === 404) {
        console.log("请求的资源不存在");
      } else {
        console.log(`发生错误：${error.message}`);
      }
    } else {
      console.log(`发生未知错误`);
    }
    return Promise.reject(error);
  }
);

export default api;
