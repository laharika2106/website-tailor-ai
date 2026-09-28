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
 * Get the existing session ID or create a new one.
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
 * Create a brand-new conversation session.
 */
export function resetSessionId(): string {
  const newId = generateSessionId();

  try {
    localStorage.setItem(SESSION_STORAGE_KEY, newId);
  } catch (error) {
    console.warn('Failed to save session ID', error);
  }

  return newId;
}

/**
 * Generate a unique session ID.
 */
function generateSessionId(): string {
  const randomPart = Math.random().toString(36).substring(2, 10);
  const timePart = Date.now().toString(36);

  return `wt_sess_${timePart}_${randomPart}`;
}

/**
 * Get n8n webhook URL.
 *
 * Priority:
 * 1. localStorage custom webhook
 * 2. Vite environment variable
 */
export function getWebhookUrl(): string {
  try {
    const customUrl = localStorage.getItem(CUSTOM_WEBHOOK_KEY);

    if (customUrl && customUrl.trim().length > 0) {
      return customUrl.trim();
    }
  } catch (error) {
    console.warn('Could not read custom webhook URL', error);
  }

  const envUrl = import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL;

  if (typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim();
  }

  return '';
}

/**
 * Save or remove a custom webhook URL.
 */
export function setCustomWebhookUrl(url: string): void {
  try {
    if (!url || url.trim().length === 0) {
      localStorage.removeItem(CUSTOM_WEBHOOK_KEY);
    } else {
      localStorage.setItem(CUSTOM_WEBHOOK_KEY, url.trim());
    }
  } catch (error) {
    console.warn('Could not save webhook URL', error);
  }
}

/**
 * Check whether a valid webhook URL exists.
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
 * Remove Markdown code fences from AI JSON.
 *
 * Handles:
 *
 * ```json
 * {...}
 * ```
 *
 * and
 *
 * ```
 * {...}
 * ```
 */
function cleanJsonString(value: string): string {
  return value
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

/**
 * Attempt to parse Nathan's structured response.
 *
 * Nathan should return:
 *
 * {
 *   "message": "I've updated your website plan.",
 *   "planUpdate": {
 *     "projectName": "...",
 *     "type": "Portfolio",
 *     "style": "Modern",
 *     "pages": [...],
 *     "features": [...]
 *   }
 * }
 */
function parseNathanResponse(value: unknown): NathanResponse | null {
  if (!value) {
    return null;
  }

  /**
   * CASE 1:
   * n8n already returned an object.
   */
  if (typeof value === 'object' && !Array.isArray(value)) {
    const objectValue = value as Record<string, unknown>;

    const messageCandidate =
      objectValue.message ||
      objectValue.output ||
      objectValue.text ||
      objectValue.response;

    const planCandidate = objectValue.planUpdate;

    if (
      planCandidate &&
      typeof planCandidate === 'object' &&
      !Array.isArray(planCandidate)
    ) {
      return {
        text:
          typeof messageCandidate === 'string' &&
          messageCandidate.trim().length > 0
            ? messageCandidate.trim()
            : 'Website plan updated.',
        planUpdate: planCandidate as WebsitePlanUpdate,
      };
    }
  }

  /**
   * CASE 2:
   * n8n/OpenAI returned JSON inside a string.
   */
  if (typeof value === 'string') {
    const cleaned = cleanJsonString(value);

    if (!cleaned) {
      return null;
    }

    try {
      const parsed = JSON.parse(cleaned);

      if (parsed && typeof parsed === 'object') {
        const messageCandidate =
          parsed.message ||
          parsed.output ||
          parsed.text ||
          parsed.response;

        const planCandidate = parsed.planUpdate;

        if (
          planCandidate &&
          typeof planCandidate === 'object' &&
          !Array.isArray(planCandidate)
        ) {
          return {
            text:
              typeof messageCandidate === 'string' &&
              messageCandidate.trim().length > 0
                ? messageCandidate.trim()
                : 'Website plan updated.',
            planUpdate: planCandidate as WebsitePlanUpdate,
          };
        }

        /**
         * Valid JSON but no planUpdate.
         */
        if (
          typeof messageCandidate === 'string' &&
          messageCandidate.trim().length > 0
        ) {
          return {
            text: messageCandidate.trim(),
          };
        }
      }
    } catch {
      /**
       * Not JSON.
       *
       * That's fine because Nathan can also have
       * normal conversations.
       */
    }
  }

  return null;
}

/**
 * Send a message to Nathan through n8n.
 */
export async function sendN8nChatMessage(params: {
  chatInput: string;
  sessionId: string;
}): Promise<NathanResponse> {
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

  /**
   * Give n8n/OpenAI enough time to answer.
   */
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 45000);

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

    /**
     * Handle HTTP errors.
     */
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');

      throw new Error(
        `HTTP_${response.status}: ${
          errorText || response.statusText
        }`
      );
    }

    const contentType =
      response.headers.get('content-type') || '';

    /**
     * ==========================================
     * JSON RESPONSE
     * ==========================================
     */
    if (contentType.includes('application/json')) {
      const rawData: unknown = await response.json();

      /**
       * n8n can sometimes return:
       *
       * [
       *   {
       *      output: "..."
       *   }
       * ]
       */
      let data: N8nChatResponse;

      if (Array.isArray(rawData) && rawData.length > 0) {
        data = rawData[0] as N8nChatResponse;
      } else {
        data = rawData as N8nChatResponse;
      }

      /**
       * ==========================================
       * IMPORTANT FIX
       * ==========================================
       *
       * Different n8n/model combinations may return
       * Nathan's structured JSON through:
       *
       * output
       * text
       * response
       * message
       *
       * We therefore check ALL of them.
       */

      const candidates: unknown[] = [
        data.output,
        data.text,
        data.response,
        data.message,
      ];

      /**
       * Also check the complete object because n8n
       * may return planUpdate directly.
       */
      candidates.push(data);

      for (const candidate of candidates) {
        const parsed = parseNathanResponse(candidate);

        if (parsed?.planUpdate) {
          console.log(
            'Nathan structured plan update:',
            parsed.planUpdate
          );

          return parsed;
        }
      }

      /**
       * No structured planUpdate was found.
       *
       * Nathan may simply be chatting normally.
       */
      const normalTextCandidate =
        data.output ||
        data.text ||
        data.response ||
        data.message;

      if (
        typeof normalTextCandidate === 'string' &&
        normalTextCandidate.trim().length > 0
      ) {
        /**
         * It might still be JSON containing only
         * a message.
         */
        const parsedNormal =
          parseNathanResponse(normalTextCandidate);

        if (parsedNormal) {
          return parsedNormal;
        }

        return {
          text: normalTextCandidate.trim(),
        };
      }

      /**
       * Unexpected but valid JSON response.
       */
      return {
        text: 'Website plan updated.',
      };
    }

    /**
     * ==========================================
     * PLAIN TEXT RESPONSE
     * ==========================================
     */

    const rawText = await response.text();

    /**
     * Even text/plain might contain JSON,
     * so attempt to parse it.
     */
    const parsedText = parseNathanResponse(rawText);

    if (parsedText) {
      return parsedText;
    }

    return {
      text:
        rawText.trim() ||
        'Website plan updated.',
    };
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('TIMEOUT');
      }

      throw error;
    }

    throw new Error('UNKNOWN_ERROR');
  }
}

/**
 * Load saved chat messages.
 */
export function loadPersistedMessages():
  | ChatMessage[]
  | null {
  try {
    const raw =
      localStorage.getItem(CHAT_HISTORY_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    if (
      Array.isArray(parsed) &&
      parsed.length > 0
    ) {
      return parsed;
    }
  } catch (error) {
    console.warn(
      'Failed to load chat history',
      error
    );
  }

  return null;
}

/**
 * Save chat messages.
 */
export function savePersistedMessages(
  messages: ChatMessage[]
): void {
  try {
    /**
     * Keep only the latest 50 messages.
     */
    const trimmed = messages.slice(-50);

    localStorage.setItem(
      CHAT_HISTORY_KEY,
      JSON.stringify(trimmed)
    );
  } catch (error) {
    console.warn(
      'Failed to save chat history',
      error
    );
  }
}

/**
 * Remove saved chat history.
 */
export function clearPersistedMessages(): void {
  try {
    localStorage.removeItem(
      CHAT_HISTORY_KEY
    );
  } catch (error) {
    console.warn(
      'Failed to clear chat history',
      error
    );
  }
}
