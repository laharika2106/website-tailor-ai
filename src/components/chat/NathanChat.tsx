import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types/chat';
import {
  Send,
  RotateCcw,
  Trash2,
  Settings,
  AlertCircle,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface NathanChatProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sessionId: string;
  isConfigured: boolean;
  onSendMessage: (text: string) => void;
  onRetry: () => void;
  onNewConversation: () => void;
  onClearConversation: () => void;
  onOpenSettings: () => void;
  suggestedPromptInput?: string | null;
  onClearSuggestedPrompt?: () => void;
}

const DEFAULT_SUGGESTED_PROMPTS = [
  'Build my portfolio',
  'Create a restaurant website',
  'I need an e-commerce store',
  'Build a website for my startup',
  'Help me design a college project',
];

export const NathanChat: React.FC<NathanChatProps> = ({
  messages,
  isLoading,
  error,
  sessionId,
  isConfigured,
  onSendMessage,
  onRetry,
  onNewConversation,
  onClearConversation,
  onOpenSettings,
  suggestedPromptInput,
  onClearSuggestedPrompt,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [avatarError, setAvatarError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // When a suggested prompt is passed from external interaction (e.g. clicking category or template)
  useEffect(() => {
    if (suggestedPromptInput) {
      setInputValue(suggestedPromptInput);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      onClearSuggestedPrompt?.();
    }
  }, [suggestedPromptInput, onClearSuggestedPrompt]);

  // Auto-scroll on new messages or typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTimestamp = (ts: number) => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0D121D] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-4 bg-[#111726] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar with fallback container */}
          <div className="relative">
            {!avatarError ? (
              <img
                src="/src/assets/images/nathan_avatar_1790603801606.jpg"
                alt="Nathan Avatar"
                referrerPolicy="no-referrer"
                onError={() => setAvatarError(true)}
                className="w-10 h-10 rounded-full object-cover border border-indigo-500/40 ring-2 ring-indigo-500/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm border border-indigo-400/40">
                N
              </div>
            )}
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#111726] ${
                isConfigured ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
              title={isConfigured ? 'Online' : 'Webhook unconfigured'}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white tracking-tight">Nathan — Website Tailor AI</h3>
              <span className="text-[10px] text-indigo-300 font-medium">Assistant</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="truncate max-w-[150px] sm:max-w-[200px] font-mono text-[10px]">
                {sessionId.slice(0, 16)}...
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 text-[11px]">Ready to advise</span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onNewConversation}
            title="Start New Conversation (resets session)"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1.5"
            aria-label="New Conversation"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">New</span>
          </button>

          <button
            onClick={onClearConversation}
            title="Clear Chat History"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            title="n8n Webhook Settings"
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Configure Webhook"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Webhook notification banner if unconfigured */}
      {!isConfigured && (
        <div className="px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>AI connection not configured yet.</span>
          </div>
          <button
            onClick={onOpenSettings}
            className="underline font-semibold text-amber-300 hover:text-white transition-colors"
          >
            Connect n8n
          </button>
        </div>
      )}

      {/* Messages viewport */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isNathan = msg.sender === 'nathan';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div
                key={msg.id}
                className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                  msg.isError
                    ? 'bg-rose-950/30 border border-rose-500/30 text-rose-300'
                    : 'bg-slate-800/60 border border-slate-700/60 text-slate-300'
                }`}
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p>{msg.text}</p>
                  {error && (
                    <button
                      onClick={onRetry}
                      disabled={isLoading}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-rose-900/60 hover:bg-rose-900 border border-rose-500/40 rounded-lg text-[11px] font-semibold text-rose-100 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                      <span>Retry</span>
                    </button>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs sm:text-sm ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Nathan avatar on left */}
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-indigo-600/40 border border-indigo-500/40 flex items-center justify-center shrink-0 text-white mt-1">
                  <Bot className="w-4 h-4 text-indigo-300" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-1`}>
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-[#151C2C] text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>

                <div
                  className={`text-[10px] text-slate-400 px-1 tabular-nums ${
                    isUser ? 'text-right' : 'text-left'
                  }`}
                >
                  {formatTimestamp(msg.timestamp)}
                </div>
              </div>

              {/* User avatar on right */}
              {isUser && (
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300 mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading typing indicator */}
        {isLoading && (
          <div className="flex gap-3 text-sm justify-start">
            <div className="w-7 h-7 rounded-full bg-indigo-600/40 border border-indigo-500/40 flex items-center justify-center shrink-0 text-white mt-1">
              <Bot className="w-4 h-4 text-indigo-300" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#151C2C] border border-slate-800 rounded-tl-none flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="ml-1 text-slate-400">Nathan is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts chips */}
      <div className="px-4 py-2 bg-[#0F1422] border-t border-slate-800/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] text-slate-400 whitespace-nowrap">Suggested:</span>
          {DEFAULT_SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={isLoading}
              onClick={() => onSendMessage(prompt)}
              className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 hover:text-white text-slate-300 border border-slate-700/60 rounded-lg whitespace-nowrap text-[11px] transition-colors disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Message input bar */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-[#111726] border-t border-slate-800">
        <div className="relative flex items-end gap-2 bg-[#0A0D14] border border-slate-700/80 rounded-xl p-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-colors">
          <textarea
            ref={inputRef}
            rows={2}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={
              isConfigured
                ? 'Describe your website idea, target audience, or desired pages...'
                : 'AI connection not configured. Enter a message to test or configure webhook in settings...'
            }
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none px-2 py-1 disabled:opacity-50 font-sans"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-all active:scale-95 shrink-0"
            aria-label="Send message to Nathan"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-2">
          Press <kbd className="px-1 py-0.5 bg-slate-800 rounded font-mono text-[9px] text-slate-300">Enter</kbd> to send · <kbd className="px-1 py-0.5 bg-slate-800 rounded font-mono text-[9px] text-slate-300">Shift + Enter</kbd> for new line
        </p>
      </form>
    </div>
  );
};
