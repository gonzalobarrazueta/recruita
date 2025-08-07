import {Message} from './message';

export interface Conversation {
  id: string;
  userId: string;
  jobPostingId: string;
  messages: Message[];
}
