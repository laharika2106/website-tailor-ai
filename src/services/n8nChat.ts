import { ChatMessage, N8nChatPayload, N8nChatResponse } from '../types/chat';

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
 * Resets the session ID for a brand new conversation.
 */
export function resetSessionId(): string {
  const newId = generateSessionId();
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, newId);
  } catch (e) {
    console.warn('Failed to persist new session ID to localStorage', e);
  }
  return newId;
}

function generateSessionId(): string {
  const randomPart = Math.random().toString(36).substring(2, 10);
  const timePart = Date.now().toString(36);
  return `wt_sess_${timePart}_${randomPart}`;
}

/**
 * Gets the configured n8n Chat webhook URL.
 * Checks localStorage custom override first, then Vite env variable.
 */
export function getWebhookUrl(): string {
  try {
    const customUrl = localStorage.getItem(CUSTOM_WEBHOOK_KEY);
    if (customUrl && customUrl.trim().length > 0) {
      return customUrl.trim();
    }
  } catch (e) {
    console.warn('Error reading custom webhook from storage', e);
  }

  const envUrl = import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL;
  if (typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim();
  }

  return '';
}

/**
 * Sets or clears a custom webhook URL in localStorage (for interactive testing / custom n8n setups).
 */
export function setCustomWebhookUrl(url: string): void {
  try {
    if (!url || url.trim().length === 0) {
      localStorage.removeItem(CUSTOM_WEBHOOK_KEY);
    } else {
      localStorage.setItem(CUSTOM_WEBHOOK_KEY, url.trim());
    }
  } catch (e) {
    console.warn('Error writing custom webhook to storage', e);
  }
}

/**
 * Checks whether an n8n webhook URL is configured.
 */
export function isWebhookConfigured(): boolean {
  const url = getWebhookUrl();
  return typeof url === 'string' && url.length > 0 && /^https?:\/\//i.test(url);
}

/**
 * Sends a message payload to the n8n Chat Trigger endpoint.
 *
 * Payload format:
 * {
 *   action: 'sendMessage',
 *   sessionId: string,
 *   chatInput: string
 * }
 */
export async function sendN8nChatMessage(params: {
  chatInput: string;
  sessionId: string;
}): Promise<string> {
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
  const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout for AI agent execution

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
      const errorText = await response.text().catch(() => '');
      throw new Error(`HTTP_${response.status}: ${errorText || response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data: N8nChatResponse | Record<string, unknown> = await response.json();
      
      // Standard n8n chat trigger response formats:
      // { output: "text" }, { text: "text" }, { response: "text" }, or { message: "text" }
      const textCandidate =
        data.output ||
        data.text ||
        data.response ||
        data.message ||
        (typeof data === 'string' ? data : null);

      if (typeof textCandidate === 'string' && textCandidate.trim().length > 0) {
        return textCandidate.trim();
      }

      // If array or nested structure returned by n8n
      if (Array.isArray(data) && data[0]) {
        const first = data[0];
        const nestedText = first.output || first.text || first.response || first.message;
        if (typeof nestedText === 'string') return nestedText.trim();
      }

      return JSON.stringify(data, null, 2);
    } else {
      const rawText = await response.text();
      return rawText.trim() || 'Website plan updated.';
    }
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
 * Local chat message history persistence (to keep the session continuity on reload).
 */
export function loadPersistedMessages(): ChatMessage[] | null {
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load chat history from localStorage', e);
  }
  return null;
}

export function savePersistedMessages(messages: ChatMessage[]): void {
  try {
    // Keep max last 50 messages to preserve storage
    const trimmed = messages.slice(-50);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn('Failed to save chat history to localStorage', e);
  }
}

export function clearPersistedMessages(): void {
  try {
    localStorage.removeItem(CHAT_HISTORY_KEY);
  } catch (e) {
    console.warn('Failed to clear chat history from localStorage', e);
  }
}
