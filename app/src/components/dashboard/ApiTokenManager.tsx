"use client";

import { useState, useEffect } from "react";
import { Key, Copy, Check, Trash2, Plus } from "lucide-react";

interface Token {
  id: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
}

export default function ApiTokenManager() {
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
      setError("載入失敗");
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
      setError("建立失敗");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/tokens/${id}`, { method: "DELETE" });
      setTokens((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("刪除失敗");
    }
  };

  const handleCopy = async () => {
    if (!newToken) return;
    await navigator.clipboard.writeText(newToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <div className="flex items-center gap-2">
        <Key className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">API 金鑰</h2>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        用於 Chrome 擴充套件連接你的帳號
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
            金鑰已產生，請立即複製（此金鑰只會顯示一次）
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 overflow-x-auto rounded bg-white px-3 py-2 text-xs text-gray-800 ring-1 ring-gray-200">
              {newToken}
            </code>
            <button
              onClick={handleCopy}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 transition-colors"
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
            我已複製，關閉此提示
          </button>
        </div>
      )}

      {/* Token 列表 */}
      <div className="mt-4">
        {isLoading ? (
          <p className="text-sm text-gray-400">載入中...</p>
        ) : tokens.length === 0 ? (
          <p className="text-sm text-gray-400">尚未建立任何金鑰</p>
        ) : (
          <div className="space-y-2">
            {tokens.map((token) => (
              <div
                key={token.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {token.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    建立於{" "}
                    {new Date(token.created_at).toLocaleDateString("zh-TW")}
                    {token.last_used_at && (
                      <>
                        {" "}
                        · 最後使用{" "}
                        {new Date(token.last_used_at).toLocaleDateString(
                          "zh-TW"
                        )}
                      </>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(token.id)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleCreate}
        disabled={isCreating}
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        {isCreating ? "建立中..." : "產生新金鑰"}
      </button>
    </div>
  );
}
