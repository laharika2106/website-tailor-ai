import { useState, useEffect, useRef, useCallback } from 'react';

import {
  ChatMessage,
  WebsitePlanUpdate,
} from '../types/chat';

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
  text: `Hi! I'm Nathan 👋
Tell me what kind of website you'd like to create, and I'll help you shape the idea.`,
  timestamp: Date.now(),
};


export function useN8nChat() {

  /**
   * ---------------------------------------------------------
   * CHAT MESSAGES
   * ---------------------------------------------------------
   */

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = loadPersistedMessages();

    return saved && saved.length > 0
      ? saved
      : [INITIAL_NATHAN_MESSAGE];
  });


  /**
   * ---------------------------------------------------------
   * SESSION
   * ---------------------------------------------------------
   *
   * This ID remains the same during the conversation.
   *
   * n8n Simple Memory uses this session ID to remember
   * previous messages.
   */

  const [sessionId, setSessionId] = useState<string>(() =>
    getOrCreateSessionId()
  );


  /**
   * ---------------------------------------------------------
   * UI STATE
   * ---------------------------------------------------------
   */

  const [isLoading, setIsLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  const [lastUserPrompt, setLastUserPrompt] =
    useState<string | null>(null);

  const [isConfigured, setIsConfigured] =
    useState<boolean>(() =>
      isWebhookConfigured()
    );

  const [webhookUrl, setWebhookUrlState] =
    useState<string>(() =>
      getWebhookUrl()
    );


  /**
   * ---------------------------------------------------------
   * WEBSITE PLAN UPDATE
   * ---------------------------------------------------------
   *
   * Nathan can now return structured website changes.
   *
   * Example:
   *
   * {
   *   type: "Portfolio",
   *   style: "Technical",
   *   pages: [
   *     "Home",
   *     "About",
   *     "Projects",
   *     "Contact"
   *   ]
   * }
   *
   * App.tsx will consume this value in the next step.
   */

  const [
    latestPlanUpdate,
    setLatestPlanUpdate,
  ] = useState<WebsitePlanUpdate | null>(null);


  /**
   * Used by the chat component to automatically
   * scroll to the newest message.
   */

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);


  /**
   * ---------------------------------------------------------
   * WEBHOOK CONFIGURATION
   * ---------------------------------------------------------
   */

  const refreshConfig = useCallback(() => {

    setIsConfigured(
      isWebhookConfigured()
    );

    setWebhookUrlState(
      getWebhookUrl()
    );

  }, []);


  /**
   * ---------------------------------------------------------
   * SAVE CHAT HISTORY
   * ---------------------------------------------------------
   */

  useEffect(() => {

    if (messages.length > 0) {
      savePersistedMessages(messages);
    }

  }, [messages]);


  /**
   * ---------------------------------------------------------
   * AUTO SCROLL
   * ---------------------------------------------------------
   */

  const scrollToBottom = useCallback(
    (smooth = true) => {

      if (messagesEndRef.current) {

        messagesEndRef.current.scrollIntoView({
          behavior: smooth
            ? 'smooth'
            : 'auto',

          block: 'end',
        });

      }

    },
    []
  );


  useEffect(() => {

    scrollToBottom(true);

  }, [
    messages,
    isLoading,
    scrollToBottom,
  ]);


  /**
   * ---------------------------------------------------------
   * SEND MESSAGE
   * ---------------------------------------------------------
   *
   * User
   * ↓
   * Website Tailor
   * ↓
   * n8n Chat Trigger
   * ↓
   * Nathan AI Agent
   * ↓
   * Gemini + Memory
   * ↓
   * text + optional planUpdate
   */

  const sendMessage = useCallback(

    async (text: string) => {

      const trimmed =
        text.trim();


      /**
       * Prevent empty or duplicate requests.
       */

      if (
        !trimmed ||
        isLoading
      ) {
        return;
      }


      setError(null);

      setLastUserPrompt(
        trimmed
      );


      /**
       * Clear the previous plan update.
       *
       * This ensures App.tsx reacts only to
       * newly generated updates.
       */

      setLatestPlanUpdate(null);


      /**
       * -----------------------------------------------------
       * ADD USER MESSAGE
       * -----------------------------------------------------
       */

      const userMessage: ChatMessage = {

        id:
          `msg_user_${Date.now()}_` +
          Math.random()
            .toString(36)
            .substring(2, 6),

        sender: 'user',

        text: trimmed,

        timestamp: Date.now(),

      };


      setMessages((prev) => [
        ...prev,
        userMessage,
      ]);


      /**
       * -----------------------------------------------------
       * CHECK N8N CONFIGURATION
       * -----------------------------------------------------
       */

      if (
        !isWebhookConfigured()
      ) {

        setIsLoading(false);

        setError(
          'NOT_CONFIGURED'
        );


        const warningMessage: ChatMessage = {

          id:
            `msg_warn_${Date.now()}`,

          sender: 'system',

          text:
            'AI connection not configured yet. Configure your n8n Chat Webhook URL in settings to enable live Nathan AI responses.',

          timestamp:
            Date.now(),

          isError: true,

        };


        setMessages((prev) => [
          ...prev,
          warningMessage,
        ]);


        return;
      }


      /**
       * -----------------------------------------------------
       * CALL N8N
       * -----------------------------------------------------
       */

      setIsLoading(true);


      try {

        const response =
          await sendN8nChatMessage({

            chatInput:
              trimmed,

            sessionId,

          });


        /**
         * response now looks like:
         *
         * {
         *   text: "...",
         *   planUpdate?: {...}
         * }
         */


        /**
         * ---------------------------------------------------
         * ADD NATHAN RESPONSE TO CHAT
         * ---------------------------------------------------
         */

        const nathanMessage: ChatMessage = {

          id:
            `msg_nathan_${Date.now()}_` +
            Math.random()
              .toString(36)
              .substring(2, 6),

          sender:
            'nathan',

          text:
            response.text,

          timestamp:
            Date.now(),

        };


        setMessages((prev) => [
          ...prev,
          nathanMessage,
        ]);


        /**
         * ---------------------------------------------------
         * SAVE STRUCTURED WEBSITE PLAN UPDATE
         * ---------------------------------------------------
         *
         * We are NOT applying it yet.
         *
         * Step 4 will connect this value to
         * useWebsitePlan().
         */

        if (
          response.planUpdate
        ) {

          setLatestPlanUpdate(
            response.planUpdate
          );

        }

      } catch (err: unknown) {

        console.error(
          'Failed to communicate with n8n:',
          err
        );


        setError(
          'CONNECTION_ERROR'
        );


        const errorMessage: ChatMessage = {

          id:
            `msg_err_${Date.now()}`,

          sender:
            'system',

          text:
            'Nathan is having trouble connecting. Please try again.',

          timestamp:
            Date.now(),

          isError:
            true,

        };


        setMessages((prev) => [
          ...prev,
          errorMessage,
        ]);

      } finally {

        setIsLoading(false);

      }

    },

    [
      isLoading,
      sessionId,
    ]

  );


  /**
   * ---------------------------------------------------------
   * RETRY LAST MESSAGE
   * ---------------------------------------------------------
   */

  const retryLastMessage =
    useCallback(() => {

      if (
        lastUserPrompt &&
        !isLoading
      ) {

        sendMessage(
          lastUserPrompt
        );

      }

    }, [
      lastUserPrompt,
      isLoading,
      sendMessage,
    ]);


  /**
   * ---------------------------------------------------------
   * START NEW CONVERSATION
   * ---------------------------------------------------------
   *
   * IMPORTANT:
   *
   * This generates a new session ID.
   *
   * Therefore n8n Simple Memory also starts
   * a completely new conversation.
   */

  const startNewConversation =
    useCallback(() => {

      const newId =
        resetSessionId();


      setSessionId(
        newId
      );


      clearPersistedMessages();


      setError(null);

      setLastUserPrompt(null);

      setLatestPlanUpdate(null);


      setMessages([
        {
          ...INITIAL_NATHAN_MESSAGE,

          id:
            `msg_welcome_${Date.now()}`,

          timestamp:
            Date.now(),
        },
      ]);

    }, []);


  /**
   * ---------------------------------------------------------
   * CLEAR CONVERSATION
   * ---------------------------------------------------------
   *
   * This clears visible messages but preserves
   * the current session ID.
   */

  const clearConversation =
    useCallback(() => {

      clearPersistedMessages();

      setError(null);

      setLastUserPrompt(null);

      setLatestPlanUpdate(null);


      setMessages([
        {
          ...INITIAL_NATHAN_MESSAGE,

          id:
            `msg_welcome_${Date.now()}`,

          timestamp:
            Date.now(),
        },
      ]);

    }, []);


  /**
   * ---------------------------------------------------------
   * CLEAR PLAN UPDATE
   * ---------------------------------------------------------
   *
   * App.tsx will call this after applying
   * Nathan's changes.
   */

  const clearLatestPlanUpdate =
    useCallback(() => {

      setLatestPlanUpdate(null);

    }, []);


  /**
   * ---------------------------------------------------------
   * RETURN PUBLIC API
   * ---------------------------------------------------------
   */

  return {

    messages,

    isLoading,

    error,

    sessionId,

    isConfigured,

    webhookUrl,

    messagesEndRef,


    /**
     * New structured AI data.
     */

    latestPlanUpdate,


    /**
     * Chat actions.
     */

    sendMessage,

    retryLastMessage,

    startNewConversation,

    clearConversation,


    /**
     * Planner action.
     */

    clearLatestPlanUpdate,


    /**
     * Configuration.
     */

    refreshConfig,

    scrollToBottom,

  };

}
