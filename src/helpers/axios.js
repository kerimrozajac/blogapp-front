import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import userActions from "../hooks/user.actions"; // Assuming userActions is the default export

const { getAccessToken, getRefreshToken } = userActions;

const axiosService = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosService.interceptors.request.use(async (config) => {
  // Retrieve the access token from localStorage and add it to the headers of the request
  const { access } = JSON.parse(localStorage.getItem("auth")) || {};
  if (access) {
    config.headers.Authorization = `Bearer ${getAccessToken()}`;
  }
  return config;
});

axiosService.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

const refreshAuthLogic = async (failedRequest) => {
  const { refresh } = JSON.parse(localStorage.getItem("auth")) || {};
  if (refresh) {
    try {
      const resp = await axios.post(
        "/refresh/token/",
        null,
        {
          baseURL: "http://localhost:8000/v1/auth",
          headers: {
            Authorization: `Bearer ${getRefreshToken()}`,
          },
        }
      );

      const { access, refresh, user } = resp.data;
      failedRequest.response.config.headers[
        "Authorization"
      ] = `Bearer ${access}`;
      localStorage.setItem(
        "auth",
        JSON.stringify({
          access,
          refresh,
          user,
        })
      );
      return Promise.resolve();
    } catch (error) {
      localStorage.removeItem("auth");
      return Promise.reject(error);
    }
  }
  return Promise.reject("No refresh token available");
};

createAuthRefreshInterceptor(axiosService, refreshAuthLogic);

export const fetcher = url => axiosService.get(url).then(res => res.data);

export default axiosService;
