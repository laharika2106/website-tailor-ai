import React, { useState } from 'react';
import { getWebhookUrl, setCustomWebhookUrl, isWebhookConfigured } from '../../services/n8nChat';
import { X, Check, AlertCircle, Link2, ExternalLink, Cpu } from 'lucide-react';

interface WebhookSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export const WebhookSettingsModal: React.FC<WebhookSettingsModalProps> = ({
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [urlInput, setUrlInput] = useState<string>(getWebhookUrl());
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [testingStatus, setTestingStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomWebhookUrl(urlInput.trim());
    setSaveSuccess(true);
    onUpdated();
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResetToEnv = () => {
    setCustomWebhookUrl('');
    setUrlInput(import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL || '');
    onUpdated();
  };

  const handleTestConnection = async () => {
    const targetUrl = urlInput.trim();
    if (!targetUrl) {
      setTestingStatus('failed');
      setTestMessage('Please enter a webhook URL first.');
      return;
    }

    setTestingStatus('testing');
    setTestMessage('Pinging webhook with test payload...');

    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendMessage',
          sessionId: 'test_session_ping',
          chatInput: 'Hello Nathan, testing webhook connection.',
        }),
      });

      if (res.ok) {
        setTestingStatus('success');
        setTestMessage('Connection successful! The n8n agent received the payload.');
      } else {
        setTestingStatus('failed');
        setTestMessage(`Received HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (err: unknown) {
      setTestingStatus('failed');
      const msg = err instanceof Error ? err.message : 'Network error or CORS restriction.';
      setTestMessage(`Connection test failed: ${msg}`);
    }
  };

  const hasConfig = isWebhookConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#111622] border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 transition-colors p-1 rounded-lg hover:bg-slate-800"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">n8n AI Agent Integration</h2>
            <p className="text-xs text-slate-400">Configure external webhook for Nathan AI responses</p>
          </div>
        </div>

        {/* Current status banner */}
        <div
          className={`mb-6 p-4 rounded-xl border text-sm flex items-start gap-3 ${
            hasConfig
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200'
              : 'bg-amber-500/10 border-amber-500/25 text-amber-200'
          }`}
        >
          {hasConfig ? (
            <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-semibold">
              {hasConfig ? 'Webhook Endpoint Configured' : 'AI connection not configured yet'}
            </p>
            <p className="text-xs opacity-90 mt-1">
              {hasConfig
                ? 'Nathan will route messages through this external endpoint.'
                : 'All planning and estimation tools work without AI. Connect your n8n Chat Trigger workflow below to activate live chat.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="webhookUrl" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Webhook URL (Production or Test)
            </label>
            <div className="relative">
              <input
                id="webhookUrl"
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://your-n8n-instance.com/webhook/chat-trigger"
                className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono transition-colors"
              />
              <Link2 className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              Default env variable: <code className="text-slate-300 bg-slate-800/80 px-1.5 py-0.5 rounded font-mono">VITE_N8N_CHAT_WEBHOOK_URL</code>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-md shadow-indigo-600/20 active:scale-95"
            >
              Save Configuration
            </button>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testingStatus === 'testing' || !urlInput.trim()}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-colors disabled:opacity-50"
            >
              {testingStatus === 'testing' ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              type="button"
              onClick={handleResetToEnv}
              className="px-3 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors ml-auto"
            >
              Reset to Env
            </button>
          </div>

          {saveSuccess && (
            <p className="text-xs text-emerald-400 flex items-center gap-1.5 pt-1">
              <Check className="w-3.5 h-3.5" /> Webhook configuration updated successfully.
            </p>
          )}

          {testingStatus !== 'idle' && (
            <div
              className={`p-3 rounded-xl text-xs mt-3 border ${
                testingStatus === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : testingStatus === 'failed'
                  ? 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300'
              }`}
            >
              {testMessage}
            </div>
          )}
        </form>

        {/* n8n Payload Specification details */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">Expected n8n Chat Trigger Format</span>
            <span className="text-[11px] text-slate-400 font-mono">POST JSON</span>
          </div>
          <p>
            When a visitor chats with Nathan, Website Tailor sends a payload containing:
          </p>
          <pre className="bg-[#0B0F17] p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-indigo-300 overflow-x-auto">
{`{
  "action": "sendMessage",
  "sessionId": "wt_sess_...",
  "chatInput": "User's website requirements"
}`}
          </pre>
          <p>
            Nathan expects a JSON response containing an <code className="text-indigo-300">output</code> or <code className="text-indigo-300">text</code> field with Nathan's response.
          </p>
        </div>
      </div>
    </div>
  );
};
