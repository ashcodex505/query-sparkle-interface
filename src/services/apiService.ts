
/**
 * Service for handling API calls to AWS API Gateway
 */

// Replace this URL with your actual AWS API Gateway endpoint
const API_ENDPOINT = "https://c5fyrfqqpj.execute-api.us-west-2.amazonaws.com/web/webScrape";

export interface ChatResponse {
  message: string;
  timestamp: string;
}

export interface ApiRequestParameters {
  name: string;
  value: string;
}

export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
  try {
    // Structure the request body according to the required format
    const requestBody = {
      apiPath: "/weather",
      actionGroup: "get_weather",
      httpMethod: "GET",
      parameters: [
        {
          name: "city",
          value: message // Using the message as the city value
        }
      ],
      sessionAttributes: {},
      promptSessionAttributes: {}
    };

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
