// interfaces/AppInterfaces.ts
export interface Message {
    role: 'user' | 'bot';
    text: string;
  }
  
  // interfaces/Responses.ts
  export interface APIResponse {
    candidates: {
      content: {
        parts: { text: string }[];
      };
    }[];
  }
  