"use client";

import { useState, useEffect } from "react";
import { Key, Copy, Check, Trash2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

interface Token {
  id: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
}

export default function ApiTokenManager() {
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      const res = await fetch("/api/tokens");
      const data = await res.json();
      setTokens(data.data ?? []);
    } catch {
      setError(tc("loadFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/tokens", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      setNewToken(data.token);
      loadTokens();
    } catch {
      setError(tc("createFailed"));
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/tokens/${id}`, { method: "DELETE" });
      setTokens((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError(tc("deleteFailed"));
    }
  };

  const handleCopy = async () => {
    if (!newToken) return;
    await navigator.clipboard.writeText(newToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-100">
      <div className="flex items-center gap-2">
        <Key className="h-5 w-5 text-text-light" />
        <h2 className="text-lg font-semibold text-text">{t("apiKeys")}</h2>
      </div>
      <p className="mt-1 text-sm text-text-light">
        {t("apiKeysDesc")}
      </p>

      {error && (
        <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 新產生的 token 提示 */}
      {newToken && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">
            {t("keyGenerated")}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 overflow-x-auto rounded bg-white px-3 py-2 text-xs text-text ring-1 ring-brand-100">
              {newToken}
            </code>
            <button
              onClick={handleCopy}
              className="rounded-lg border border-brand-200 p-2 text-text-light hover:bg-[color:var(--color-bg)] transition-colors"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <button
            onClick={() => setNewToken(null)}
            className="mt-2 text-xs text-green-700 hover:underline"
          >
            {t("keyCopied")}
          </button>
        </div>
      )}

      {/* Token 列表 */}
      <div className="mt-4">
        {isLoading ? (
          <p className="text-sm text-text-placeholder">{tc("loading")}</p>
        ) : tokens.length === 0 ? (
          <p className="text-sm text-text-placeholder">{t("noKeys")}</p>
        ) : (
          <div className="space-y-2">
            {tokens.map((token) => (
              <div
                key={token.id}
                className="flex items-center justify-between rounded-lg border border-brand-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-text">
                    {token.name}
                  </p>
                  <p className="text-xs text-text-light">
                    {t("createdAt", {
                      date: new Date(token.created_at).toLocaleDateString("zh-TW"),
                    })}
                    {token.last_used_at && (
                      <>
                        {" "}
                        ·{" "}
                        {t("lastUsed", {
                          date: new Date(token.last_used_at).toLocaleDateString(
                            "zh-TW"
                          ),
                        })}
                      </>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(token.id)}
                  className="rounded-lg p-1.5 text-text-placeholder hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        onClick={handleCreate}
        loading={isCreating}
        variant="secondary"
        leftIcon={<Plus className="h-4 w-4" />}
        className="mt-4"
      >
        {t("generateKey")}
      </Button>
    </div>
  );
}
