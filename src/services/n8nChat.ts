import {
  ChatMessage,
  N8nChatPayload,
  N8nChatResponse,
  NathanResponse,
  WebsitePlanUpdate,
} from '../types/chat';

const SESSION_STORAGE_KEY = 'website_tailor_session_id';
const CUSTOM_WEBHOOK_KEY = 'website_tailor_custom_webhook_url';
const CHAT_HISTORY_KEY = 'website_tailor_chat_messages';

/**
 * Retrieves the persistent session ID or generates a new one.
 * Session ID is maintained across messages and reloads.
 */
export function getOrCreateSessionId(): string {
  try {
    const existing = localStorage.getItem(SESSION_STORAGE_KEY);

    if (existing && existing.trim().length > 0) {
      return existing;
    }

    const newId = generateSessionId();
    localStorage.setItem(SESSION_STORAGE_KEY, newId);

    return newId;
  } catch {
    return generateSessionId();
  }
}

/**
 * Resets the session ID for a brand-new conversation.
 */
export function resetSessionId(): string {
  const newId = generateSessionId();

  try {
    localStorage.setItem(SESSION_STORAGE_KEY, newId);
  } catch (e) {
    console.warn(
      'Failed to persist new session ID to localStorage',
      e
    );
  }

  return newId;
}

/**
 * Generates a unique Website Tailor chat session ID.
 */
function generateSessionId(): string {
  const randomPart = Math.random()
    .toString(36)
    .substring(2, 10);

  const timePart = Date.now().toString(36);

  return `wt_sess_${timePart}_${randomPart}`;
}

/**
 * Gets the configured n8n Chat webhook URL.
 *
 * Priority:
 * 1. Custom localStorage override
 * 2. Vite environment variable
 */
export function getWebhookUrl(): string {
  try {
    const customUrl = localStorage.getItem(
      CUSTOM_WEBHOOK_KEY
    );

    if (
      customUrl &&
      customUrl.trim().length > 0
    ) {
      return customUrl.trim();
    }
  } catch (e) {
    console.warn(
      'Error reading custom webhook from storage',
      e
    );
  }

  const envUrl =
    import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL;

  if (
    typeof envUrl === 'string' &&
    envUrl.trim().length > 0
  ) {
    return envUrl.trim();
  }

  return '';
}

/**
 * Sets or clears a custom webhook URL.
 *
 * Useful during development/testing.
 */
export function setCustomWebhookUrl(
  url: string
): void {
  try {
    if (!url || url.trim().length === 0) {
      localStorage.removeItem(CUSTOM_WEBHOOK_KEY);
    } else {
      localStorage.setItem(
        CUSTOM_WEBHOOK_KEY,
        url.trim()
      );
    }
  } catch (e) {
    console.warn(
      'Error writing custom webhook to storage',
      e
    );
  }
}

/**
 * Checks whether an n8n webhook is configured.
 */
export function isWebhookConfigured(): boolean {
  const url = getWebhookUrl();

  return (
    typeof url === 'string' &&
    url.length > 0 &&
    /^https?:\/\//i.test(url)
  );
}

/**
 * Sends a message to the n8n AI Agent.
 *
 * Request:
 *
 * {
 *   action: "sendMessage",
 *   sessionId: "...",
 *   chatInput: "..."
 * }
 *
 * Nathan can return either:
 *
 * 1. Normal text
 *
 * OR
 *
 * 2. Structured JSON:
 *
 * {
 *   "message": "I've updated your plan.",
 *   "planUpdate": {
 *      "type": "Portfolio",
 *      "style": "Technical",
 *      "pages": [...]
 *   }
 * }
 */
export async function sendN8nChatMessage(
  params: {
    chatInput: string;
    sessionId: string;
  }
): Promise<NathanResponse> {
  const webhookUrl = getWebhookUrl();

  if (!webhookUrl) {
    throw new Error('WEBHOOK_NOT_CONFIGURED');
  }

  const payload: N8nChatPayload = {
    action: 'sendMessage',
    sessionId: params.sessionId,
    chatInput: params.chatInput.trim(),
  };

  const controller = new AbortController();

  const timeoutId = setTimeout(
    () => controller.abort(),
    35000
  );

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain',
      },

      body: JSON.stringify(payload),

      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response
        .text()
        .catch(() => '');

      throw new Error(
        `HTTP_${response.status}: ${
          errorText || response.statusText
        }`
      );
    }

    const contentType =
      response.headers.get('content-type') || '';

    /**
     * JSON RESPONSE
     */
    if (
      contentType.includes('application/json')
    ) {
      const rawData: unknown =
        await response.json();

      let data: N8nChatResponse;

      /**
       * n8n may occasionally return:
       *
       * [
       *   {
       *      output: "..."
       *   }
       * ]
       */
      if (
        Array.isArray(rawData) &&
        rawData.length > 0
      ) {
        data =
          rawData[0] as N8nChatResponse;
      } else {
        data =
          rawData as N8nChatResponse;
      }

      /**
       * Standard n8n response formats.
       */
      const textCandidate =
        data.output ||
        data.text ||
        data.response ||
        data.message;

      let text =
        typeof textCandidate === 'string'
          ? textCandidate.trim()
          : '';

      let planUpdate:
        | WebsitePlanUpdate
        | undefined =
        data.planUpdate;

      /**
       * IMPORTANT:
       *
       * The n8n AI Agent may return JSON
       * INSIDE the "output" string.
       *
       * Example:
       *
       * {
       *   "output":
       *   "{\"message\":\"Done\",\"planUpdate\":{...}}"
       * }
       *
       * Therefore we try to parse output.
       */
      if (
        typeof data.output === 'string'
      ) {
        const output =
          data.output.trim();

        try {
          /**
           * Gemini sometimes wraps JSON in:
           *
           * ```json
           * {...}
           * ```
           *
           * Remove those fences first.
           */
          const cleanedOutput = output
            .replace(
              /^```json\s*/i,
              ''
            )
            .replace(
              /^```\s*/i,
              ''
            )
            .replace(
              /\s*```$/i,
              ''
            )
            .trim();

          const parsed =
            JSON.parse(cleanedOutput);

          if (
            parsed &&
            typeof parsed === 'object'
          ) {
            const parsedMessage =
              parsed.message ||
              parsed.output ||
              parsed.text ||
              parsed.response;

            if (
              typeof parsedMessage ===
                'string' &&
              parsedMessage.trim().length >
                0
            ) {
              text =
                parsedMessage.trim();
            }

            if (
              parsed.planUpdate &&
              typeof parsed.planUpdate ===
                'object'
            ) {
              planUpdate =
                parsed.planUpdate as WebsitePlanUpdate;
            }
          }
        } catch {
          /**
           * Normal conversational output
           * isn't JSON.
           *
           * That's completely fine.
           */
        }
      }

      if (!text) {
        text =
          'Website plan updated.';
      }

      return {
        text,
        planUpdate,
      };
    }

    /**
     * PLAIN TEXT RESPONSE
     */
    const rawText =
      await response.text();

    return {
      text:
        rawText.trim() ||
        'Website plan updated.',
    };
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (
        error.name === 'AbortError'
      ) {
        throw new Error('TIMEOUT');
      }

      throw error;
    }

    throw new Error('UNKNOWN_ERROR');
  }
}

/**
 * Loads saved chat history.
 */
export function loadPersistedMessages():
  | ChatMessage[]
  | null {
  try {
    const raw =
      localStorage.getItem(
        CHAT_HISTORY_KEY
      );

    if (!raw) {
      return null;
    }

    const parsed =
      JSON.parse(raw);

    if (
      Array.isArray(parsed) &&
      parsed.length > 0
    ) {
      return parsed;
    }
  } catch (e) {
    console.warn(
      'Failed to load chat history from localStorage',
      e
    );
  }

  return null;
}

/**
 * Saves chat history.
 */
export function savePersistedMessages(
  messages: ChatMessage[]
): void {
  try {
    /**
     * Keep only the last 50 messages
     * to prevent excessive localStorage usage.
     */
    const trimmed =
      messages.slice(-50);

    localStorage.setItem(
      CHAT_HISTORY_KEY,
      JSON.stringify(trimmed)
    );
  } catch (e) {
    console.warn(
      'Failed to save chat history to localStorage',
      e
    );
  }
}

/**
 * Clears locally saved chat history.
 */
export function clearPersistedMessages(): void {
  try {
    localStorage.removeItem(
      CHAT_HISTORY_KEY
    );
  } catch (e) {
    console.warn(
      'Failed to clear chat history from localStorage',
      e
    );
  }
}
