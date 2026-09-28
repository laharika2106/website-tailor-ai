export type MessageSender = 'user' | 'nathan' | 'system';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface N8nChatPayload {
  action: 'sendMessage';
  sessionId: string;
  chatInput: string;
}

export interface N8nChatResponse {
  output?: string;
  text?: string;
  response?: string;
  message?: string;
  sessionId?: string;
}

export interface WebhookConfig {
  url: string;
  isCustom: boolean;
  status: 'unconfigured' | 'configured' | 'connected' | 'error';
  lastChecked?: number;
}
