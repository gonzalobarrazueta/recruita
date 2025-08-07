export enum Sender {
  USER = 'user',
  AI = 'ai',
}

export interface Message {
  userId: string;
  conversationId: string;
  content: string;
  sender: Sender;
}
