import axios, { type AxiosRequestHeaders } from "axios";


const api = axios.create({
  baseURL: "https://www.budgie.fit/api",
  withCredentials: true,
});


// ===== REQUEST INTERCEPTOR =====
api.interceptors.request.use(
  (config) => {
   if (config.url?.includes("/auth/refresh")) {
       if (config.headers) delete config.headers.Authorization;
      return config;
    }

    const raw = localStorage.getItem("accessToken");
    const token = raw?.replace(/[\r\n\s]/g, "");

  if (token) {
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
    return config;
  },
  (error) => Promise.reject(error)
  );

//  RESPONSE INTERCEPTOR 
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

     if (config?.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // accessToken 만료 → 401 
    if (response?.status === 401 && !config._retry &&
      !config.url?.includes("/auth/refresh")
    ) {
      config._retry = true;

      // 이미 refresh 요청 중이면 기다리기
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken) => {
            config.headers = (config.headers ?? {}) as AxiosRequestHeaders;
            config.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(config));
          });
        });
      }

      // === refreshToken으로 accessToken 재발급 ===
      isRefreshing = true;

      try {
        const res = await api.post(
          "/auth/refresh",
          {},
          {withCredentials: true}
        );

        const newAccessToken = res.data.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        isRefreshing = false;
        onRefreshed(newAccessToken);

        config.headers = (config.headers ?? {}) as AxiosRequestHeaders;
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(config);
      } catch (err) {
        isRefreshing = false;
        refreshSubscribers = [];
        localStorage.removeItem("accessToken");
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
