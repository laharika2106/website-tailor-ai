import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from '../types/chat';
import {
  getOrCreateSessionId,
  resetSessionId,
  sendN8nChatMessage,
  isWebhookConfigured,
  getWebhookUrl,
  loadPersistedMessages,
  savePersistedMessages,
  clearPersistedMessages,
} from '../services/n8nChat';

const INITIAL_NATHAN_MESSAGE: ChatMessage = {
  id: 'msg_welcome',
  sender: 'nathan',
  text: `Hi! I'm Nathan 👋\nTell me what kind of website you'd like to create, and I'll help you shape the idea.`,
  timestamp: Date.now(),
};

export function useN8nChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = loadPersistedMessages();
    return saved && saved.length > 0 ? saved : [INITIAL_NATHAN_MESSAGE];
  });

  const [sessionId, setSessionId] = useState<string>(() => getOrCreateSessionId());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUserPrompt, setLastUserPrompt] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean>(() => isWebhookConfigured());
  const [webhookUrl, setWebhookUrlState] = useState<string>(() => getWebhookUrl());

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Re-check webhook configuration status
  const refreshConfig = useCallback(() => {
    setIsConfigured(isWebhookConfigured());
    setWebhookUrlState(getWebhookUrl());
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      savePersistedMessages(messages);
    }
  }, [messages]);

  // Scroll to bottom when messages update or loading changes
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end',
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isLoading, scrollToBottom]);

  /**
   * Send a user message to Nathan (via n8n chat trigger)
   */
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      setLastUserPrompt(trimmed);

      // Add user message to thread
      const userMessage: ChatMessage = {
        id: `msg_user_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        sender: 'user',
        text: trimmed,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Check if n8n webhook is configured
      if (!isWebhookConfigured()) {
        setIsLoading(false);
        setError('NOT_CONFIGURED');
        const warningMsg: ChatMessage = {
          id: `msg_warn_${Date.now()}`,
          sender: 'system',
          text: 'AI connection not configured yet. Configure your n8n Chat Webhook URL in settings to enable live Nathan AI responses.',
          timestamp: Date.now(),
          isError: true,
        };
        setMessages((prev) => [...prev, warningMsg]);
        return;
      }

      setIsLoading(true);

      try {
        const responseText = await sendN8nChatMessage({
          chatInput: trimmed,
          sessionId,
        });

        const nathanMessage: ChatMessage = {
          id: `msg_nathan_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          sender: 'nathan',
          text: responseText,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, nathanMessage]);
      } catch (err: unknown) {
        console.error('Failed to communicate with n8n:', err);
        setError('CONNECTION_ERROR');

        const errorMsg: ChatMessage = {
          id: `msg_err_${Date.now()}`,
          sender: 'system',
          text: 'Nathan is having trouble connecting. Please try again.',
          timestamp: Date.now(),
          isError: true,
        };

        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, sessionId]
  );

  /**
   * Retry the last sent message
   */
  const retryLastMessage = useCallback(() => {
    if (lastUserPrompt && !isLoading) {
      sendMessage(lastUserPrompt);
    }
  }, [lastUserPrompt, isLoading, sendMessage]);

  /**
   * Start a brand new conversation:
   * Generates a NEW sessionId (as required), resets message thread.
   */
  const startNewConversation = useCallback(() => {
    const newId = resetSessionId();
    setSessionId(newId);
    clearPersistedMessages();
    setError(null);
    setLastUserPrompt(null);
    setMessages([
      {
        ...INITIAL_NATHAN_MESSAGE,
        id: `msg_welcome_${Date.now()}`,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  /**
   * Clear all conversation messages
   */
  const clearConversation = useCallback(() => {
    clearPersistedMessages();
    setError(null);
    setLastUserPrompt(null);
    setMessages([
      {
        ...INITIAL_NATHAN_MESSAGE,
        id: `msg_welcome_${Date.now()}`,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sessionId,
    isConfigured,
    webhookUrl,
    messagesEndRef,
    sendMessage,
    retryLastMessage,
    startNewConversation,
    clearConversation,
    refreshConfig,
    scrollToBottom,
  };
}
