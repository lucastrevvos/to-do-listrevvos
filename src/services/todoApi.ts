import { getOrCreateGuestId } from "@/src/storage/guest";
import axios from "axios";

export const todoApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.0.14:3333",
  timeout: 15000,
});

todoApi.interceptors.request.use(async (config) => {
  const guestId = await getOrCreateGuestId();
  console.log("Guest ID:", guestId);
  config.headers = config.headers ?? {};
  config.headers["X-Guest-Id"] = guestId;
  return config;
});

export async function createSharedList(title: string) {
  const { data } = await todoApi.post("/v1/todo/lists", {
    title,
  });

  return data; // deve retornar { id, title, role }
}
