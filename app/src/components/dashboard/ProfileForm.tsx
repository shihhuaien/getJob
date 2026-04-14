"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  email: string;
  fullName: string | null;
}

export default function ProfileForm({ email, fullName }: ProfileFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(fullName || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("姓名不可為空");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "發生錯誤");
      setSuccess(true);
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName(fullName || "");
    setError(null);
    setSuccess(false);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          電子郵件
        </label>
        <p className="mt-1 text-sm text-gray-900">{email}</p>
      </div>

      <div>
        <label
          htmlFor="full_name"
          className="block text-sm font-medium text-gray-700"
        >
          姓名
        </label>
        {isEditing ? (
          <div className="mt-1">
            <input
              id="full_name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="輸入你的姓名"
              maxLength={100}
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? "儲存中..." : "儲存"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-1 flex items-center gap-3">
            <p className="text-sm text-gray-900">
              {fullName || "未設定"}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              編輯
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-600">已更新</p>
      )}
    </div>
  );
}
