import type {
  DetectRequestBody,
  DetectResponse,
  HistoryResponse,
  StatsResponse,
} from "@/types";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // ngrok requires this header to skip the browser warning page
    "ngrok-skip-browser-warning": "true",
  },
});

export const postDetect = async (
  imageBase64: string,
): Promise<DetectResponse> => {
  const body: DetectRequestBody = { image: imageBase64 };
  const { data } = await api.post<DetectResponse>("/detect", body);
  return data;
};

export const getHistory = async (): Promise<HistoryResponse> => {
  const { data } = await api.get<HistoryResponse>("/detect/history");
  return data;
};

export const getStats = async (): Promise<StatsResponse> => {
  const { data } = await api.get<StatsResponse>("/detect/stats");
  return data;
};
