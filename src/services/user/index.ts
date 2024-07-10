import { User } from "@/lib/types";

type Response<T> = {
  data?: T | null;
  message?: string | null;
  error?: boolean | null;
};

const getAllUser = async (): Promise<Response<User[]>> => {
  try {
    const response = await fetch("https://dummyjson.com/users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok)
      return { data: null, message: "Not connected to api", error: true };

    const jsonData = (await response.json())["users"] as User[];

    return {
      data: jsonData,
      message: "Succes",
      error: false,
    };
  } catch {
    return { data: null, message: "Failed to fetch", error: true };
  }
};

const getUser = async (userId: number): Promise<Response<User>> => {
  try {
    const response = await fetch(`https://dummyjson.com/users/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok)
      return { data: null, message: "Not connected to api", error: true };

    const jsonData = (await response.json()) as User;

    return {
      data: jsonData,
      message: "Succes",
      error: false,
    };
  } catch {
    return { data: null, message: "Failed to fetch", error: true };
  }
};

const updateUser = async (
  userId: number,
  userData: Partial<User>
): Promise<Response<User>> => {
  try {
    const response = await fetch(`https://dummyjson.com/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      return { data: null, message: "Not connected to api", error: true };
    }

    const jsonData = (await response.json()) as User;

    return {
      data: jsonData,
      message: "Succes",
      error: false,
    };
  } catch {
    return { data: null, message: "Failed to fetch", error: true };
  }
};

const deleteUser = async (userId: number): Promise<Response<User>> => {
  try {
    const response = await fetch(`https://dummyjson.com/users/${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return { data: null, message: "Not connected to api", error: true };
    }
    const jsonData = (await response.json()) as User;
    return {
      data: jsonData,
      message: "Succes",
      error: false,
    };
  } catch {
    return { data: null, message: "Failed to fetch", error: true };
  }
};

export { getAllUser, getUser, updateUser, deleteUser };
