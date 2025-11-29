import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "";
axios.defaults.withCredentials = true;

// ===== REQUEST INTERCEPTOR =====
axios.interceptors.request.use(
  (config) => {
   if (config.url?.includes("/auth/refresh")) {
      return config;
    }
const token = localStorage.getItem("accessToken");
    if (token) {
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

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

    // accessToken 만료 → 401 
    if (response?.status === 401 && !config._retry) {
      config._retry = true;

      // 이미 refresh 요청 중이면 기다리기
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken) => {
            config.headers.Authorization = `Bearer ${newToken}`;
            resolve(axios(config));
          });
        });
      }

      // === refreshToken으로 accessToken 재발급 ===
      isRefreshing = true;

      try {
        const res = await axios.post(
          "/auth/refresh",
          {},
          {withCredentials: true}
        );

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        isRefreshing = false;
        onRefreshed(newAccessToken);

        config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(config);
      } catch (err) {
        isRefreshing = false;
        localStorage.removeItem("accessToken");
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
