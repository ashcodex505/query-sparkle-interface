
/**
 * Service for handling API calls to AWS API Gateway
 */

// Replace this URL with your actual AWS API Gateway endpoint
const API_ENDPOINT = "https://0nerb7x9f9.execute-api.us-west-2.amazonaws.com/Part2WebScrape/bedrock-llm";

export interface ChatResponse {
  statusCode?: number;
  body?: string;
  message?: string;
  timestamp?: string;
}

export interface ApiRequestParameters {
  name: string;
  value: string;
}

export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
  try {
    // Structure the request body according to the required format
    const requestBody = {
      "body": {
        "prompt": message
      }
    }

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
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
