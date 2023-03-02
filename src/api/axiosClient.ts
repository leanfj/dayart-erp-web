import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export class AxiosClient {
  private static instance: AxiosInstance;
  private static readonly baseURL = process.env.REACT_APP_API_URL;
  private constructor() {}

  public static getInstance(): AxiosClient {
    if (!AxiosClient.instance) {
      AxiosClient.instance = axios.create({
        baseURL: AxiosClient.baseURL,
      });
    }

    return AxiosClient.instance;
  }

  public get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return axios.get(url, config);
  }

  public post(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return axios.post(url, data, config);
  }

  public put(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return axios.put(url, data, config);
  }

  public patch(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return axios.patch(url, data, config);
  }

  public delete(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return axios.delete(url, config);
  }
}
