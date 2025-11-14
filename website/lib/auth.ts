// lib/auth.ts
import api, { setAuthToken } from "./apiHook";

const TOKEN_KEY = "todo_token";

export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  setAuthToken(token);
};

export const loadToken = () => {
  const t = localStorage.getItem(TOKEN_KEY);
  if (t) setAuthToken(t);
  return t;
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  setAuthToken(undefined);
};

// API calls matching Django backend endpoints
export const signup = async (data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/api/users/signup/", data);
  return res.data;
};

export const login = async (data: { email: string; password: string }) => {
  // API uses email field for login
  const res = await api.post("/api/auth/login/", {
    email: data.email,
    password: data.password,
  });
  // Django JWT returns { access: "...", refresh: "..." }
  return res.data;
};

export const refreshToken = async (refresh: string) => {
  const res = await api.post("/api/auth/refresh/", { refresh });
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/api/users/me/");
  return res.data;
};

export const changePassword = async (data: {
  old_password: string;
  new_password: string;
}) => {
  const res = await api.post("/api/users/change-password/", data);
  return res.data;
};

export const updateProfile = async (data: {
  first_name?: string;
  last_name?: string;
  email?: string;
  address?: string;
  contact_number?: string;
  birthday?: string;
  profile_image?: File;
}) => {
  // Ensure token is loaded before making request
  const token = loadToken() || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
  if (!token) {
    throw new Error("No authentication token found");
  }

  // Ensure token is set in axios instance
  setAuthToken(token);

  const formData = new FormData();
  
  // Append all fields, including empty strings to clear fields if needed
  if (data.first_name !== undefined) formData.append("first_name", data.first_name);
  if (data.last_name !== undefined) formData.append("last_name", data.last_name);
  if (data.email !== undefined) formData.append("email", data.email);
  if (data.address !== undefined) formData.append("address", data.address);
  if (data.contact_number !== undefined) formData.append("contact_number", data.contact_number);
  if (data.birthday !== undefined) formData.append("birthday", data.birthday);
  
  // Append file if it exists and is a File object
  if (data.profile_image && data.profile_image instanceof File) {
    formData.append("profile_image", data.profile_image, data.profile_image.name);
  }

  // Send FormData - axios will automatically set Content-Type to multipart/form-data with boundary
  // The interceptor will handle removing the default Content-Type header
  const res = await api.patch("/api/users/me/", formData);
  return res.data;
};

export const fetchTodos = async () => {
  const res = await api.get("/api/todos/");
  // API returns paginated response with results array
  return res.data.results || res.data;
};

export const createTodo = async (payload: {
  title: string;
  description?: string;
  priority?: "extreme" | "moderate" | "low";
  todo_date?: string;
}) => {
  const res = await api.post("/api/todos/", payload);
  return res.data;
};

export const updateTodo = async (id: string, payload: any) => {
  const res = await api.patch(`/api/todos/${id}/`, payload);
  return res.data;
};

export const deleteTodo = async (id: string) => {
  const res = await api.delete(`/api/todos/${id}/`);
  return res.data;
};

// Reorder todos by updating position field
export const reorderTodos = async (todos: Array<{ id: string | number; position: number }>) => {
  // Update each todo's position
  const promises = todos.map((todo, index) =>
    updateTodo(String(todo.id), { position: index + 1 })
  );
  await Promise.all(promises);
};
