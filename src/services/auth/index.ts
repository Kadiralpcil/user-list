"use server";

import { loginUser } from "@/lib/types";

// src/services/auth.ts
const Login = async (username?: string, password?: string) => {
  const response = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 30,
    }),
  });

  if (!response.ok) {
    throw new Error("username or password invalid");
  }

  const data = (await response.json()) as loginUser;

  return data;
};

export { Login };
