export enum Sender {
  USER = 'user',
  AI = 'ai',
}

export interface Message {
  id: string;
  userId: string;
  jobPostingId?: string; // Messages belong to a chat about an specific job posting
  content: string;
  conversationId: string;
  sender: Sender;
}
