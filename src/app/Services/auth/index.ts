"use server";

import { loginUser } from "@/app/Lib/types";
import { cookies } from "next/headers";

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
    const errorData = await response.json();
    throw new Error("username or password invalid");
  }

  const data = (await response.json()) as loginUser;

  return data;
};

const logOut = () => {
  cookies().delete("email");
  cookies().delete("firstname");
  cookies().delete("gender");
  cookies().delete("id");
  cookies().delete("image");
  cookies().delete("lastName");
  cookies().delete("refreshToken");
  cookies().delete("token");
  cookies().delete("username");
};

export { Login, logOut };
