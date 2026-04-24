"use client";

import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { Briefcase } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => {
    if (!value) return "";
    return EMAIL_RE.test(value) ? "" : t("invalidEmail");
  };

  const validatePassword = (value: string) => {
    if (!value) return "";
    return value.length >= 6 ? "" : t("passwordTooShort");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const emailIssue = validateEmail(email);
    const passwordIssue = validatePassword(password);
    if (emailIssue || passwordIssue) {
      setEmailError(emailIssue);
      setPasswordError(passwordIssue);
      return;
    }
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  if (success) {
    return (
      <main
        id="main-content"
        tabIndex={-1}
        className="flex min-h-screen items-center justify-center bg-[color:var(--color-bg)] px-4 focus:outline-none"
      >
        <div className="w-full max-w-md text-center">
          <Briefcase className="mx-auto h-12 w-12 text-brand-600" />
          <h1 className="mt-4 text-2xl font-bold text-text">
            {t("confirmEmail")}
          </h1>
          <p className="mt-2 text-text-light">
            {t("confirmEmailDesc", { email })}
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block text-sm font-medium text-brand-600 hover:text-brand-500"
          >
            {t("backToLogin")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-screen items-center justify-center bg-[color:var(--color-bg)] px-4 focus:outline-none"
    >
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-brand-600" />
            <span className="text-2xl font-bold text-text">Offery</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-text">
            {t("registerTitle")}
          </h1>
          <p className="mt-2 text-sm text-text-light">
            {t("hasAccount")}{" "}
            <Link
              href="/login"
              className="font-medium text-brand-600 hover:text-brand-500"
            >
              {t("loginLink")}
            </Link>
          </p>
        </div>

        <div className="mt-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-brand-100">
          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-brand-200 bg-white px-4 py-2.5 text-sm font-medium text-text hover:bg-[color:var(--color-bg)] transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {t("googleRegister")}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-100" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-text-light">{t("orEmail")}</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-text"
              >
                {t("name")}
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder={t("namePlaceholder")}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text"
              >
                {t("email")}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(validateEmail(e.target.value));
                }}
                onBlur={(e) => setEmailError(validateEmail(e.target.value))}
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? "email-error" : undefined}
                className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="you@example.com"
              />
              {emailError && (
                <p id="email-error" className="mt-1 text-xs text-error">
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text"
              >
                {t("password")}
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError)
                    setPasswordError(validatePassword(e.target.value));
                }}
                onBlur={(e) => setPasswordError(validatePassword(e.target.value))}
                aria-invalid={Boolean(passwordError)}
                aria-describedby={passwordError ? "password-error" : undefined}
                className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder={t("passwordHint")}
              />
              {passwordError && (
                <p id="password-error" className="mt-1 text-xs text-error">
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
              {loading ? t("registering") : t("register")}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
