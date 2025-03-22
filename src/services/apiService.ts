
/**
 * Service for handling API calls to AWS API Gateway
 */

// Replace this URL with your actual AWS API Gateway endpoint
const API_ENDPOINT = "https://api.example.com/chat";

export interface ChatResponse {
  message: string;
  timestamp: string;
}

export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`API error with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message to API:', error);
    throw error;
  }
};
