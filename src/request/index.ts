import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const removeAccountCache = (account: string) => {
  const accountTokens = JSON.parse(
    localStorage.getItem("account-tokens") ?? "{}"
  );
  delete accountTokens[account];
  // return accountTokens[account];
  localStorage.setItem("account-tokens", JSON.stringify(accountTokens));
};
class Request {
  instance: AxiosInstance;
  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
    this.instance.interceptors.request.use((config) => {
      if (localStorage.token) {
        config.headers["Authorization"] = "Bearer " + localStorage.token;
      }
      return config;
    });
    this.instance.interceptors.response.use(
      (res) => {
        return res;
      },
      (err) => {
        if (err.response && err.response.status == 401) {
          // logout
          removeAccountCache(localStorage.address);
          console.log("logout");
          // localStorage.token = "";
          // localStorage.address = "";
          localStorage.removeItem("token");
          localStorage.removeItem("address");
          location.reload();
        }
        console.log(err);
      }
    );
  }
  request<T>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.instance
        .request<T>(config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  get<T>(config: AxiosRequestConfig) {
    return this.request<T>({
      ...config,
      method: "GET",
    });
  }
  post<T>(config: AxiosRequestConfig) {
    return this.request<T>({
      ...config,
      method: "POST",
    });
  }
  put<T>(config: AxiosRequestConfig) {
    return this.request<T>({
      ...config,
      method: "PUT",
    });
  }
  delete<T>(config: AxiosRequestConfig) {
    return this.request<T>({
      ...config,
      method: "DELETE",
    });
  }
}

export default Request;
