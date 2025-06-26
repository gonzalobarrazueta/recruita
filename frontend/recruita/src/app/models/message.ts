export enum Sender {
  USER = 'user',
  AI = 'ai',
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  conversationId: string;
  created_at: string;
  sender: Sender;
}
