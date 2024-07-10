import { User } from "@/app/Lib/types";

const getAllUser = async (): Promise<User[]> => {
  const response = await fetch("https://dummyjson.com/users", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData || "Failed to fetch users");
  }

  const data = await response.json();
  return data.users as User[];
};

const getUser = async (userId: number) => {
  const response = await fetch(`https://dummyjson.com/users/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData || "Failed to fetch user");
  }

  const data = await response.json();
  return data as User;
};

const updateUser = async (userId: number, userData: Partial<User>) => {
  try {
    const response = await fetch(`https://dummyjson.com/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in updateUser:", error);
    throw error;
  }
};

const deleteUser = async (userId: number) => {
  try {
    const response = await fetch(`https://dummyjson.com/users/${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData || "Failed to delete user");
    }

    const data = await response.json();
    console.log("User deleted:", data);

    return data;
  } catch (error) {
    console.error("Failed to delete user:", error);
  }
};

export { getAllUser, getUser, updateUser, deleteUser };
