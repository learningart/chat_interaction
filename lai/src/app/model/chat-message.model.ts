export interface ChatMessageModel {
  message: string;
  firstMessage: boolean;
  badges: any[];
  displayName: string;
  emotes: string;
  isSubscriber: boolean;
  color: string;
  replyDisplayName: string;
  isReply: boolean;
}
