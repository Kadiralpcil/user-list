import { Card } from "@/app/Lib/types";

const getCardsByUserId = async (userId: number) => {
  const response = await fetch(`https://dummyjson.com/carts/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData || "Failed to fetch cards");
  }

  const data = (await response.json()) as Card;
  return data;
};

const deleteCardsFromUser = () => {
  console.log("deleteCardsFromUser");
};

const addCardsToUser = () => {
  console.log("addCardsToUser");
};

const updateCard = async (cardId: number, cardData: Partial<Card>) => {
  try {
    const response = await fetch(`https://dummyjson.com/users/${cardId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cardData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update card");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in updateUser:", error);
    throw error;
  }
};

export { getCardsByUserId, deleteCardsFromUser, addCardsToUser, updateCard };
