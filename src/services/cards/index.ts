import { Card } from "@/lib/types";

type Response<T> = {
  data?: T | null;
  message?: string | null;
  error?: boolean | null;
};

const getCardsByUserId = async (userId: number): Promise<Response<Card>> => {
  try {
    const response = await fetch(`https://dummyjson.com/carts/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      return { data: null, message: "Not connected to api", error: true };
    }
    const jsonData = (await response.json()) as Card;
    return {
      data: jsonData,
      message: "Succes",
      error: false,
    };
  } catch {
    return { data: null, message: "Failed to fetch", error: true };
  }
};

const updateCard = async (
  cardId: number,
  cardData: Partial<Card>
): Promise<Response<Card>> => {
  try {
    const response = await fetch(`https://dummyjson.com/users/${cardId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cardData),
    });
    if (!response.ok) {
      return { data: null, message: "Not connected to api", error: true };
    }
    const jsonData = (await response.json()) as Card;
    return {
      data: jsonData,
      message: "Succes",
      error: false,
    };
  } catch {
    return { data: null, message: "Failed to fetch", error: true };
  }
};

export { getCardsByUserId, updateCard };
